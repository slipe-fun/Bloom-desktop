use std::{
    fs,
    path::{Path, PathBuf},
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};

use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    crypto::{
        decrypt_bytes, derive_pbkdf2, encrypt_bytes, namespace_locator, pbkdf2_response,
        secret_locator, unwrap_key, wrap_key, Pbkdf2Response, WrappedKey, DEFAULT_KEY_LEN,
        DEFAULT_PBKDF2_DK_LEN, DEFAULT_PBKDF2_ITERATIONS, DEFAULT_SALT_LEN,
    },
    error::{AppError, AppResult},
};

const SECURITY_METADATA_VERSION: u32 = 1;
const SECURITY_DIRECTORY_NAME: &str = "secure-storage";
const SECURITY_METADATA_FILE: &str = "metadata.json";
const MESSAGES_DB_FILE: &str = "messages.db";
const VAULT_DB_FILE: &str = "vault.db";

#[derive(Debug, Clone)]
struct StoragePaths {
    root_dir: PathBuf,
    metadata_file: PathBuf,
    messages_db_file: PathBuf,
    vault_db_file: PathBuf,
}

#[derive(Debug, Default)]
struct SessionState {
    message_key: Option<Vec<u8>>,
    vault_key: Option<Vec<u8>>,
}

#[derive(Debug)]
pub struct SecureStorageState {
    paths: StoragePaths,
    session: Mutex<SessionState>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SecurityStatus {
    pub initialized: bool,
    pub unlocked: bool,
    pub storage_path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Pbkdf2Config {
    algorithm: String,
    iterations: u32,
    dk_len: usize,
    salt_b64: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SecurityMetadata {
    version: u32,
    created_at: i64,
    kdf: Pbkdf2Config,
    message_key: WrappedKey,
    vault_key: WrappedKey,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageRecord {
    pub id: String,
    pub server_id: i64,
    pub chat_id: i64,
    pub content: String,
    pub author_id: i64,
    pub date: i64,
    pub seen: Option<i64>,
    pub nonce: Option<String>,
    pub reply_to_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageUpsertInput {
    pub id: Option<String>,
    pub server_id: i64,
    pub chat_id: i64,
    pub content: String,
    pub author_id: i64,
    pub date: i64,
    pub seen: Option<i64>,
    pub nonce: Option<String>,
    pub reply_to_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageQueryInput {
    pub chat_id: i64,
    pub limit: Option<u32>,
    pub before_date: Option<i64>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SecretDescriptor {
    pub namespace: String,
    pub name: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug)]
struct RawMessageRow {
    id: String,
    server_id: i64,
    chat_id: i64,
    content_ciphertext: Vec<u8>,
    content_nonce: Vec<u8>,
    author_id: i64,
    date: i64,
    seen: Option<i64>,
    nonce: Option<String>,
    reply_to_id: Option<String>,
}

#[derive(Debug)]
struct RawSecretRow {
    namespace_ciphertext: Vec<u8>,
    namespace_nonce: Vec<u8>,
    name_ciphertext: Vec<u8>,
    name_nonce: Vec<u8>,
    value_ciphertext: Vec<u8>,
    value_nonce: Vec<u8>,
    created_at: i64,
    updated_at: i64,
}

impl SecureStorageState {
    pub fn new(app_data_dir: PathBuf) -> AppResult<Self> {
        let root_dir = app_data_dir.join(SECURITY_DIRECTORY_NAME);
        fs::create_dir_all(&root_dir)?;
        set_private_file_permissions(&root_dir)?;

        let paths = StoragePaths {
            metadata_file: root_dir.join(SECURITY_METADATA_FILE),
            messages_db_file: root_dir.join(MESSAGES_DB_FILE),
            vault_db_file: root_dir.join(VAULT_DB_FILE),
            root_dir,
        };

        Ok(Self {
            paths,
            session: Mutex::new(SessionState::default()),
        })
    }

    pub fn status(&self) -> AppResult<SecurityStatus> {
        let session = self.session.lock().map_err(|_| AppError::StatePoisoned)?;

        Ok(SecurityStatus {
            initialized: self.paths.metadata_file.exists(),
            unlocked: session.message_key.is_some() && session.vault_key.is_some(),
            storage_path: self.paths.root_dir.to_string_lossy().to_string(),
        })
    }

    pub fn initialize(&self, password: &str) -> AppResult<SecurityStatus> {
        if password.is_empty() {
            return Err(AppError::InvalidArgument(
                "password must not be empty".into(),
            ));
        }

        if self.paths.metadata_file.exists() {
            return Err(AppError::AlreadyInitialized);
        }

        let salt = crate::crypto::random_bytes(DEFAULT_SALT_LEN)?;
        let key_encryption_key = derive_pbkdf2(
            password,
            &salt,
            DEFAULT_PBKDF2_ITERATIONS,
            DEFAULT_PBKDF2_DK_LEN,
        );
        let message_key = crate::crypto::random_bytes(DEFAULT_KEY_LEN)?;
        let vault_key = crate::crypto::random_bytes(DEFAULT_KEY_LEN)?;

        let metadata = SecurityMetadata {
            version: SECURITY_METADATA_VERSION,
            created_at: now_ms(),
            kdf: Pbkdf2Config {
                algorithm: "pbkdf2-sha256".into(),
                iterations: DEFAULT_PBKDF2_ITERATIONS,
                dk_len: DEFAULT_PBKDF2_DK_LEN,
                salt_b64: BASE64.encode(&salt),
            },
            message_key: wrap_key(&key_encryption_key, &message_key)?,
            vault_key: wrap_key(&key_encryption_key, &vault_key)?,
        };

        initialize_messages_db(&self.paths.messages_db_file)?;
        initialize_vault_db(&self.paths.vault_db_file)?;
        write_metadata_atomic(&self.paths.metadata_file, &metadata)?;
        self.set_session_keys(message_key, vault_key)?;

        self.status()
    }

    pub fn unlock(&self, password: &str) -> AppResult<SecurityStatus> {
        if password.is_empty() {
            return Err(AppError::InvalidArgument(
                "password must not be empty".into(),
            ));
        }

        let metadata = self.read_metadata()?;
        let salt = BASE64.decode(&metadata.kdf.salt_b64)?;
        let key_encryption_key = derive_pbkdf2(
            password,
            &salt,
            metadata.kdf.iterations,
            metadata.kdf.dk_len,
        );
        let message_key = unwrap_key(&key_encryption_key, &metadata.message_key)?;
        let vault_key = unwrap_key(&key_encryption_key, &metadata.vault_key)?;

        self.set_session_keys(message_key, vault_key)?;
        self.status()
    }

    pub fn lock(&self) -> AppResult<()> {
        let mut session = self.session.lock().map_err(|_| AppError::StatePoisoned)?;
        zeroize_option_vec(&mut session.message_key);
        zeroize_option_vec(&mut session.vault_key);
        Ok(())
    }

    pub fn derive_password_key(
        &self,
        password: &str,
        salt_b64: Option<String>,
        iterations: Option<u32>,
        dk_len: Option<usize>,
    ) -> AppResult<Pbkdf2Response> {
        if password.is_empty() {
            return Err(AppError::InvalidArgument(
                "password must not be empty".into(),
            ));
        }

        let iterations = iterations.unwrap_or(DEFAULT_PBKDF2_ITERATIONS);
        let dk_len = dk_len.unwrap_or(DEFAULT_PBKDF2_DK_LEN);

        if iterations == 0 {
            return Err(AppError::InvalidArgument(
                "iterations must be greater than zero".into(),
            ));
        }

        if dk_len == 0 {
            return Err(AppError::InvalidArgument(
                "derived key length must be greater than zero".into(),
            ));
        }

        let salt = match salt_b64 {
            Some(encoded) => Some(BASE64.decode(encoded)?),
            None => None,
        };

        pbkdf2_response(password, salt, iterations, dk_len)
    }

    pub fn upsert_message(&self, input: MessageUpsertInput) -> AppResult<MessageRecord> {
        validate_message_input(&input)?;
        let id = input.id.unwrap_or_else(|| Uuid::new_v4().to_string());
        let key = self.message_key()?;
        let encrypted_content = encrypt_bytes(&key, input.content.as_bytes())?;
        let timestamp = now_ms();
        let connection = open_connection(&self.paths.messages_db_file)?;

        connection.execute(
            r#"
            INSERT INTO messages (
              id,
              server_id,
              chat_id,
              content_ciphertext,
              content_nonce,
              author_id,
              date,
              seen,
              nonce,
              reply_to_id,
              created_at,
              updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              server_id = excluded.server_id,
              chat_id = excluded.chat_id,
              content_ciphertext = excluded.content_ciphertext,
              content_nonce = excluded.content_nonce,
              author_id = excluded.author_id,
              date = excluded.date,
              seen = excluded.seen,
              nonce = excluded.nonce,
              reply_to_id = excluded.reply_to_id,
              updated_at = excluded.updated_at
            "#,
            params![
                id,
                input.server_id,
                input.chat_id,
                encrypted_content.ciphertext,
                encrypted_content.nonce.to_vec(),
                input.author_id,
                input.date,
                input.seen,
                input.nonce,
                input.reply_to_id,
                timestamp,
                timestamp,
            ],
        )?;

        self.get_message_by_id_internal(&id)
    }

    pub fn get_messages_by_chat(&self, query: MessageQueryInput) -> AppResult<Vec<MessageRecord>> {
        if query.chat_id <= 0 {
            return Err(AppError::InvalidArgument(
                "chatId must be greater than zero".into(),
            ));
        }

        let key = self.message_key()?;
        let connection = open_connection(&self.paths.messages_db_file)?;
        let limit = i64::from(query.limit.unwrap_or(50).max(1));

        let rows = if let Some(before_date) = query.before_date {
            let mut statement = connection.prepare(
                r#"
                SELECT
                  id,
                  server_id,
                  chat_id,
                  content_ciphertext,
                  content_nonce,
                  author_id,
                  date,
                  seen,
                  nonce,
                  reply_to_id
                FROM messages
                WHERE chat_id = ?1 AND date < ?2
                ORDER BY date DESC
                LIMIT ?3
                "#,
            )?;

            let mapped =
                statement.query_map(params![query.chat_id, before_date, limit], |row| {
                    Ok(RawMessageRow {
                        id: row.get(0)?,
                        server_id: row.get(1)?,
                        chat_id: row.get(2)?,
                        content_ciphertext: row.get(3)?,
                        content_nonce: row.get(4)?,
                        author_id: row.get(5)?,
                        date: row.get(6)?,
                        seen: row.get(7)?,
                        nonce: row.get(8)?,
                        reply_to_id: row.get(9)?,
                    })
                })?;

            mapped.collect::<Result<Vec<_>, _>>()?
        } else {
            let mut statement = connection.prepare(
                r#"
                SELECT
                  id,
                  server_id,
                  chat_id,
                  content_ciphertext,
                  content_nonce,
                  author_id,
                  date,
                  seen,
                  nonce,
                  reply_to_id
                FROM messages
                WHERE chat_id = ?1
                ORDER BY date DESC
                LIMIT ?2
                "#,
            )?;

            let mapped = statement.query_map(params![query.chat_id, limit], |row| {
                Ok(RawMessageRow {
                    id: row.get(0)?,
                    server_id: row.get(1)?,
                    chat_id: row.get(2)?,
                    content_ciphertext: row.get(3)?,
                    content_nonce: row.get(4)?,
                    author_id: row.get(5)?,
                    date: row.get(6)?,
                    seen: row.get(7)?,
                    nonce: row.get(8)?,
                    reply_to_id: row.get(9)?,
                })
            })?;

            mapped.collect::<Result<Vec<_>, _>>()?
        };

        rows.into_iter()
            .map(|row| decrypt_message_row(&key, row))
            .collect()
    }

    pub fn get_message_by_id(&self, id: String) -> AppResult<Option<MessageRecord>> {
        if id.trim().is_empty() {
            return Err(AppError::InvalidArgument("id must not be empty".into()));
        }

        self.get_message_by_id_optional(&id)
    }

    pub fn get_message_by_server_id(&self, server_id: i64) -> AppResult<Option<MessageRecord>> {
        if server_id < 0 {
            return Err(AppError::InvalidArgument(
                "serverId must be zero or positive".into(),
            ));
        }

        let key = self.message_key()?;
        let connection = open_connection(&self.paths.messages_db_file)?;
        let row = connection
            .query_row(
                r#"
                SELECT
                  id,
                  server_id,
                  chat_id,
                  content_ciphertext,
                  content_nonce,
                  author_id,
                  date,
                  seen,
                  nonce,
                  reply_to_id
                FROM messages
                WHERE server_id = ?1
                ORDER BY date DESC
                LIMIT 1
                "#,
                params![server_id],
                |row| {
                    Ok(RawMessageRow {
                        id: row.get(0)?,
                        server_id: row.get(1)?,
                        chat_id: row.get(2)?,
                        content_ciphertext: row.get(3)?,
                        content_nonce: row.get(4)?,
                        author_id: row.get(5)?,
                        date: row.get(6)?,
                        seen: row.get(7)?,
                        nonce: row.get(8)?,
                        reply_to_id: row.get(9)?,
                    })
                },
            )
            .optional()?;

        row.map(|value| decrypt_message_row(&key, value))
            .transpose()
    }

    pub fn mark_message_seen(
        &self,
        id: Option<String>,
        server_id: Option<i64>,
        seen: Option<i64>,
    ) -> AppResult<Option<MessageRecord>> {
        let resolved_id = match (id, server_id) {
            (Some(message_id), _) if !message_id.trim().is_empty() => message_id,
            (None, Some(server_identifier)) => {
                if let Some(message) = self.get_message_by_server_id(server_identifier)? {
                    message.id
                } else {
                    return Ok(None);
                }
            }
            _ => {
                return Err(AppError::InvalidArgument(
                    "either id or serverId must be provided".into(),
                ))
            }
        };

        let connection = open_connection(&self.paths.messages_db_file)?;
        let updated = connection.execute(
            "UPDATE messages SET seen = ?1, updated_at = ?2 WHERE id = ?3",
            params![seen, now_ms(), resolved_id],
        )?;

        if updated == 0 {
            return Ok(None);
        }

        self.get_message_by_id_optional(&resolved_id)
    }

    pub fn delete_message(&self, id: String) -> AppResult<bool> {
        if id.trim().is_empty() {
            return Err(AppError::InvalidArgument("id must not be empty".into()));
        }

        let connection = open_connection(&self.paths.messages_db_file)?;
        let deleted = connection.execute("DELETE FROM messages WHERE id = ?1", params![id])?;
        Ok(deleted > 0)
    }

    pub fn set_secret(&self, namespace: String, name: String, value_b64: String) -> AppResult<()> {
        validate_secret_identifier("namespace", &namespace)?;
        validate_secret_identifier("name", &name)?;

        let vault_key = self.vault_key()?;
        let namespace_hash = namespace_locator(&vault_key, &namespace);
        let entry_hash = secret_locator(&vault_key, &namespace, &name);
        let secret_value = BASE64.decode(value_b64)?;
        let encrypted_namespace = encrypt_bytes(&vault_key, namespace.as_bytes())?;
        let encrypted_name = encrypt_bytes(&vault_key, name.as_bytes())?;
        let encrypted_value = encrypt_bytes(&vault_key, &secret_value)?;
        let timestamp = now_ms();
        let connection = open_connection(&self.paths.vault_db_file)?;

        connection.execute(
            r#"
            INSERT INTO secrets (
              namespace_locator,
              entry_locator,
              namespace_ciphertext,
              namespace_nonce,
              name_ciphertext,
              name_nonce,
              value_ciphertext,
              value_nonce,
              created_at,
              updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
            ON CONFLICT(entry_locator) DO UPDATE SET
              namespace_locator = excluded.namespace_locator,
              namespace_ciphertext = excluded.namespace_ciphertext,
              namespace_nonce = excluded.namespace_nonce,
              name_ciphertext = excluded.name_ciphertext,
              name_nonce = excluded.name_nonce,
              value_ciphertext = excluded.value_ciphertext,
              value_nonce = excluded.value_nonce,
              updated_at = excluded.updated_at
            "#,
            params![
                namespace_hash,
                entry_hash,
                encrypted_namespace.ciphertext,
                encrypted_namespace.nonce.to_vec(),
                encrypted_name.ciphertext,
                encrypted_name.nonce.to_vec(),
                encrypted_value.ciphertext,
                encrypted_value.nonce.to_vec(),
                timestamp,
                timestamp,
            ],
        )?;

        Ok(())
    }

    pub fn get_secret(&self, namespace: String, name: String) -> AppResult<Option<String>> {
        validate_secret_identifier("namespace", &namespace)?;
        validate_secret_identifier("name", &name)?;

        let vault_key = self.vault_key()?;
        let connection = open_connection(&self.paths.vault_db_file)?;
        let row = connection
            .query_row(
                r#"
                SELECT
                  namespace_ciphertext,
                  namespace_nonce,
                  name_ciphertext,
                  name_nonce,
                  value_ciphertext,
                  value_nonce,
                  created_at,
                  updated_at
                FROM secrets
                WHERE entry_locator = ?1
                "#,
                params![secret_locator(&vault_key, &namespace, &name)],
                |row| {
                    Ok(RawSecretRow {
                        namespace_ciphertext: row.get(0)?,
                        namespace_nonce: row.get(1)?,
                        name_ciphertext: row.get(2)?,
                        name_nonce: row.get(3)?,
                        value_ciphertext: row.get(4)?,
                        value_nonce: row.get(5)?,
                        created_at: row.get(6)?,
                        updated_at: row.get(7)?,
                    })
                },
            )
            .optional()?;

        row.map(|raw| decode_secret_value(&vault_key, raw))
            .transpose()
            .map(|value| value.map(|bytes| BASE64.encode(bytes)))
    }

    pub fn delete_secret(&self, namespace: String, name: String) -> AppResult<bool> {
        validate_secret_identifier("namespace", &namespace)?;
        validate_secret_identifier("name", &name)?;

        let vault_key = self.vault_key()?;
        let connection = open_connection(&self.paths.vault_db_file)?;
        let deleted = connection.execute(
            "DELETE FROM secrets WHERE entry_locator = ?1",
            params![secret_locator(&vault_key, &namespace, &name)],
        )?;

        Ok(deleted > 0)
    }

    pub fn list_secrets(&self, namespace: Option<String>) -> AppResult<Vec<SecretDescriptor>> {
        if let Some(ref namespace_name) = namespace {
            validate_secret_identifier("namespace", namespace_name)?;
        }

        let vault_key = self.vault_key()?;
        let connection = open_connection(&self.paths.vault_db_file)?;

        let rows = if let Some(namespace_name) = namespace {
            let namespace_hash = namespace_locator(&vault_key, &namespace_name);
            let mut statement = connection.prepare(
                r#"
                SELECT
                  namespace_ciphertext,
                  namespace_nonce,
                  name_ciphertext,
                  name_nonce,
                  value_ciphertext,
                  value_nonce,
                  created_at,
                  updated_at
                FROM secrets
                WHERE namespace_locator = ?1
                ORDER BY updated_at DESC
                "#,
            )?;

            let mapped = statement.query_map(params![namespace_hash], |row| {
                Ok(RawSecretRow {
                    namespace_ciphertext: row.get(0)?,
                    namespace_nonce: row.get(1)?,
                    name_ciphertext: row.get(2)?,
                    name_nonce: row.get(3)?,
                    value_ciphertext: row.get(4)?,
                    value_nonce: row.get(5)?,
                    created_at: row.get(6)?,
                    updated_at: row.get(7)?,
                })
            })?;

            mapped.collect::<Result<Vec<_>, _>>()?
        } else {
            let mut statement = connection.prepare(
                r#"
                SELECT
                  namespace_ciphertext,
                  namespace_nonce,
                  name_ciphertext,
                  name_nonce,
                  value_ciphertext,
                  value_nonce,
                  created_at,
                  updated_at
                FROM secrets
                ORDER BY updated_at DESC
                "#,
            )?;

            let mapped = statement.query_map([], |row| {
                Ok(RawSecretRow {
                    namespace_ciphertext: row.get(0)?,
                    namespace_nonce: row.get(1)?,
                    name_ciphertext: row.get(2)?,
                    name_nonce: row.get(3)?,
                    value_ciphertext: row.get(4)?,
                    value_nonce: row.get(5)?,
                    created_at: row.get(6)?,
                    updated_at: row.get(7)?,
                })
            })?;

            mapped.collect::<Result<Vec<_>, _>>()?
        };

        rows.into_iter()
            .map(|row| decode_secret_descriptor(&vault_key, row))
            .collect()
    }

    fn get_message_by_id_internal(&self, id: &str) -> AppResult<MessageRecord> {
        self.get_message_by_id_optional(id)?
            .ok_or_else(|| AppError::InvalidArgument("message does not exist".into()))
    }

    fn get_message_by_id_optional(&self, id: &str) -> AppResult<Option<MessageRecord>> {
        let key = self.message_key()?;
        let connection = open_connection(&self.paths.messages_db_file)?;
        let row = connection
            .query_row(
                r#"
                SELECT
                  id,
                  server_id,
                  chat_id,
                  content_ciphertext,
                  content_nonce,
                  author_id,
                  date,
                  seen,
                  nonce,
                  reply_to_id
                FROM messages
                WHERE id = ?1
                "#,
                params![id],
                |row| {
                    Ok(RawMessageRow {
                        id: row.get(0)?,
                        server_id: row.get(1)?,
                        chat_id: row.get(2)?,
                        content_ciphertext: row.get(3)?,
                        content_nonce: row.get(4)?,
                        author_id: row.get(5)?,
                        date: row.get(6)?,
                        seen: row.get(7)?,
                        nonce: row.get(8)?,
                        reply_to_id: row.get(9)?,
                    })
                },
            )
            .optional()?;

        row.map(|value| decrypt_message_row(&key, value))
            .transpose()
    }

    fn read_metadata(&self) -> AppResult<SecurityMetadata> {
        if !self.paths.metadata_file.exists() {
            return Err(AppError::NotInitialized);
        }

        let raw = fs::read_to_string(&self.paths.metadata_file)?;
        let metadata: SecurityMetadata = serde_json::from_str(&raw)?;

        if metadata.version != SECURITY_METADATA_VERSION {
            return Err(AppError::InvalidArgument(format!(
                "unsupported metadata version {}",
                metadata.version
            )));
        }

        Ok(metadata)
    }

    fn set_session_keys(&self, message_key: Vec<u8>, vault_key: Vec<u8>) -> AppResult<()> {
        let mut session = self.session.lock().map_err(|_| AppError::StatePoisoned)?;
        zeroize_option_vec(&mut session.message_key);
        zeroize_option_vec(&mut session.vault_key);
        session.message_key = Some(message_key);
        session.vault_key = Some(vault_key);
        Ok(())
    }

    fn message_key(&self) -> AppResult<Vec<u8>> {
        let session = self.session.lock().map_err(|_| AppError::StatePoisoned)?;
        session.message_key.clone().ok_or(AppError::Locked)
    }

    fn vault_key(&self) -> AppResult<Vec<u8>> {
        let session = self.session.lock().map_err(|_| AppError::StatePoisoned)?;
        session.vault_key.clone().ok_or(AppError::Locked)
    }
}

fn initialize_messages_db(path: &Path) -> AppResult<()> {
    let connection = open_connection(path)?;
    connection.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          server_id INTEGER NOT NULL,
          chat_id INTEGER NOT NULL,
          content_ciphertext BLOB NOT NULL,
          content_nonce BLOB NOT NULL,
          author_id INTEGER NOT NULL,
          date INTEGER NOT NULL,
          seen INTEGER NULL,
          nonce TEXT NULL,
          reply_to_id TEXT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_messages_server_id ON messages(server_id);
        CREATE INDEX IF NOT EXISTS idx_messages_chat_id_date ON messages(chat_id, date DESC);
        CREATE INDEX IF NOT EXISTS idx_messages_author_id ON messages(author_id);
        CREATE INDEX IF NOT EXISTS idx_messages_reply_to_id ON messages(reply_to_id);
        "#,
    )?;
    set_private_file_permissions(path)?;

    Ok(())
}

fn initialize_vault_db(path: &Path) -> AppResult<()> {
    let connection = open_connection(path)?;
    connection.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS secrets (
          namespace_locator TEXT NOT NULL,
          entry_locator TEXT PRIMARY KEY,
          namespace_ciphertext BLOB NOT NULL,
          namespace_nonce BLOB NOT NULL,
          name_ciphertext BLOB NOT NULL,
          name_nonce BLOB NOT NULL,
          value_ciphertext BLOB NOT NULL,
          value_nonce BLOB NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_secrets_namespace_locator
        ON secrets(namespace_locator);
        "#,
    )?;
    set_private_file_permissions(path)?;

    Ok(())
}

fn open_connection(path: &Path) -> AppResult<Connection> {
    let connection = Connection::open(path)?;
    connection.busy_timeout(std::time::Duration::from_secs(5))?;
    connection.pragma_update(None, "journal_mode", "WAL")?;
    connection.pragma_update(None, "foreign_keys", "ON")?;
    connection.pragma_update(None, "secure_delete", "ON")?;
    connection.pragma_update(None, "temp_store", "MEMORY")?;
    connection.pragma_update(None, "trusted_schema", "OFF")?;
    Ok(connection)
}

fn write_metadata_atomic(path: &Path, metadata: &SecurityMetadata) -> AppResult<()> {
    let serialized = serde_json::to_vec_pretty(metadata)?;
    let tmp_path = path.with_extension("json.tmp");
    fs::write(&tmp_path, serialized)?;
    set_private_file_permissions(&tmp_path)?;
    fs::rename(tmp_path, path)?;
    set_private_file_permissions(path)?;
    Ok(())
}

fn decrypt_message_row(message_key: &[u8], row: RawMessageRow) -> AppResult<MessageRecord> {
    let plaintext = decrypt_bytes(message_key, &row.content_ciphertext, &row.content_nonce)?;
    let content = String::from_utf8(plaintext)
        .map_err(|_| AppError::InvalidArgument("message payload is not valid UTF-8".into()))?;

    Ok(MessageRecord {
        id: row.id,
        server_id: row.server_id,
        chat_id: row.chat_id,
        content,
        author_id: row.author_id,
        date: row.date,
        seen: row.seen,
        nonce: row.nonce,
        reply_to_id: row.reply_to_id,
    })
}

fn decode_secret_value(vault_key: &[u8], row: RawSecretRow) -> AppResult<Vec<u8>> {
    validate_secret_row(vault_key, &row)?;
    decrypt_bytes(vault_key, &row.value_ciphertext, &row.value_nonce)
}

fn decode_secret_descriptor(vault_key: &[u8], row: RawSecretRow) -> AppResult<SecretDescriptor> {
    let namespace = String::from_utf8(decrypt_bytes(
        vault_key,
        &row.namespace_ciphertext,
        &row.namespace_nonce,
    )?)
    .map_err(|_| AppError::InvalidArgument("namespace is not valid UTF-8".into()))?;
    let name = String::from_utf8(decrypt_bytes(
        vault_key,
        &row.name_ciphertext,
        &row.name_nonce,
    )?)
    .map_err(|_| AppError::InvalidArgument("secret name is not valid UTF-8".into()))?;

    Ok(SecretDescriptor {
        namespace,
        name,
        created_at: row.created_at,
        updated_at: row.updated_at,
    })
}

fn validate_secret_row(vault_key: &[u8], row: &RawSecretRow) -> AppResult<()> {
    let _ = decrypt_bytes(vault_key, &row.namespace_ciphertext, &row.namespace_nonce)?;
    let _ = decrypt_bytes(vault_key, &row.name_ciphertext, &row.name_nonce)?;
    Ok(())
}

fn validate_message_input(input: &MessageUpsertInput) -> AppResult<()> {
    if input.chat_id <= 0 {
        return Err(AppError::InvalidArgument(
            "chatId must be greater than zero".into(),
        ));
    }

    if input.author_id <= 0 {
        return Err(AppError::InvalidArgument(
            "authorId must be greater than zero".into(),
        ));
    }

    if input.date <= 0 {
        return Err(AppError::InvalidArgument(
            "date must be a positive unix timestamp in milliseconds".into(),
        ));
    }

    if input.content.is_empty() {
        return Err(AppError::InvalidArgument(
            "message content must not be empty".into(),
        ));
    }

    if let Some(ref id) = input.id {
        if id.trim().is_empty() {
            return Err(AppError::InvalidArgument("id must not be empty".into()));
        }
    }

    Ok(())
}

fn validate_secret_identifier(field: &str, value: &str) -> AppResult<()> {
    if value.trim().is_empty() {
        return Err(AppError::InvalidArgument(format!(
            "{field} must not be empty"
        )));
    }

    Ok(())
}

fn now_ms() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("system clock should be after UNIX_EPOCH")
        .as_millis() as i64
}

fn zeroize_option_vec(secret: &mut Option<Vec<u8>>) {
    if let Some(bytes) = secret.as_mut() {
        bytes.fill(0);
    }
    *secret = None;
}

fn set_private_file_permissions(path: &Path) -> AppResult<()> {
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;

        let metadata = fs::metadata(path)?;
        let mode = if metadata.is_dir() { 0o700 } else { 0o600 };
        let permissions = fs::Permissions::from_mode(mode);
        fs::set_permissions(path, permissions)?;
    }

    Ok(())
}

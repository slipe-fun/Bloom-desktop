use argon2::Argon2;
use directories::ProjectDirs;
use keyring::Entry;
use rand::RngCore;
use std::ffi::{CStr, CString};
use std::fs;
use std::os::raw::{c_char, c_int, c_uchar};
use std::path::Path;
use std::sync::OnceLock;
use tauri::Manager;
use bip39::{Mnemonic, Language};

// Application identifier for the OS system keychain
const SERVICE_NAME: &str = "pw.bloomapp.desktop";
const KEY_NAME: &str = "db_encryption_key";
const SALT_KEY_NAME: &str = "argon2_salt"; // separate keychain entry for the Argon2 salt
const STRONGHOLD_KEY_NAME: &str = "stronghold_vault_key";

// RAM caches to avoid thread races between Rust and React. Two distinct caches
// because the two secrets must never be derived from or equal to one another.
static DB_KEY_CACHE: OnceLock<[u8; 32]> = OnceLock::new();
static STRONGHOLD_KEY_CACHE: OnceLock<[u8; 32]> = OnceLock::new();

#[cfg(target_os = "windows")]
#[link(name = "legacy_stdio_definitions")]
extern "C" {}

pub type ChatsCallback = Option<unsafe extern "C" fn(json_data: *const c_char)>;
pub type MessagesCallback = Option<unsafe extern "C" fn(json_data: *const c_char)>;

// C-FFI imports
extern "C" {
    pub fn InitClient(
        base_url: *const c_char,
        ws_url: *const c_char,
        storage_path: *const c_char,
        enc_key: *const c_uchar,
        key_len: c_int,
    ) -> *mut c_char;

    pub fn FreeString(p: *mut c_char);
    pub fn Register() -> *mut c_char;
    pub fn Login(raw_recovery_key: *const c_char) -> *mut c_char;
    pub fn RestoreSession() -> *mut c_char;
    pub fn ClearCredentials();
    pub fn GetMe() -> *mut c_char;
    pub fn SearchUsers(query: *const c_char) -> *mut c_char;
    pub fn EditUser(
        username: *const c_char,
        display_name: *const c_char,
        description: *const c_char,
        has_username: c_int,
        has_display_name: c_int,
        has_description: c_int,
    ) -> *mut c_char;
    pub fn GetUser(user_id: *const c_char) -> *mut c_char;
    pub fn CreateChat(
        user_id: *const c_char,
        ml_kem_768_key: *const c_char,
        x448_key: *const c_char,
        ed448_key: *const c_char,
    ) -> *mut c_char;
    pub fn GetChats() -> *mut c_char;
    pub fn GetLocalChats() -> *mut c_char;
    pub fn SendMessage(chat_id: c_int, reply_to_id: c_int, content: *const c_char) -> *mut c_char;
    pub fn LoadMessages(chat_id: c_int, before_id: c_int) -> *mut c_char;
    pub fn StartExchangeSession(exchange_type: *const c_char) -> *mut c_char;
    pub fn Exchange(
        exchange_type: *const c_char,
        room_id: *const c_char,
        fingerprint: *const c_char,
    ) -> *mut c_char;
    pub fn CancelExchange();
    pub fn RegisterChatsCallback(cb: ChatsCallback);
    pub fn UnregisterChatsCallback();
    pub fn RegisterMessagesCallback(cb: MessagesCallback);
    pub fn UnregisterMessagesCallback();
}

/// Converts a C string returned by the FFI layer into a Rust String and frees it.
///
/// ASSUMPTION (not verified against the C/Go library source, which is not available
/// in this context): a null pointer means "success, no data". If the library can
/// also return null on allocation failure, this will incorrectly be treated as success.
/// This should be confirmed against the actual library implementation.
pub unsafe fn c_to_string_and_free(ptr: *mut c_char) -> Result<String, String> {
    if ptr.is_null() {
        return Ok("OK".to_string());
    }
    let c_str = CStr::from_ptr(ptr);
    let result = c_str.to_str().map_err(|e| e.to_string())?.to_string();
    FreeString(ptr);

    if is_error_response(&result) {
        Err(result)
    } else {
        Ok(result)
    }
}

/// Detects whether a response string represents an error.
///
/// LIMITATION: the exact wire format produced by the FFI library is not available
/// in this context. This function first tries to interpret the response as JSON
/// and look for a structural error indicator (an "error" field with a non-empty
/// value, or an explicit "ok": false), which is far less prone to false positives
/// than a plain substring search. If the response is not valid JSON, it falls back
/// to the original substring check, which can still misfire on legitimate payloads
/// that happen to contain the word "error" (e.g. a user's display name or a chat
/// message). Replacing this fallback correctly requires knowing the library's
/// actual response schema.
fn is_error_response(result: &str) -> bool {
    if let Ok(value) = serde_json::from_str::<serde_json::Value>(result) {
        if let Some(ok) = value.get("ok").and_then(|v| v.as_bool()) {
            return !ok;
        }
        if let Some(err) = value.get("error") {
            return !err.is_null() && err.as_str().map_or(true, |s| !s.is_empty());
        }
        // Valid JSON with no recognizable error field: treat as success.
        return false;
    }

    // Fallback for non-JSON responses. Known to be imprecise, see doc comment above.
    result.contains("error")
}

/// Retrieves the system storage directory.
fn get_storage_path() -> Result<String, String> {
    let proj_dirs = ProjectDirs::from("pw", "bloomapp", "Bloom")
        .ok_or_else(|| "Could not determine the system user data directory".to_string())?;

    let data_dir = proj_dirs.data_dir();
    fs::create_dir_all(data_dir)
        .map_err(|e| format!("Could not create storage directory: {}", e))?;

    Ok(data_dir.to_string_lossy().to_string())
}

fn generate_random_bytes_32() -> [u8; 32] {
    let mut buf = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut buf);
    buf
}

fn generate_random_bytes_16() -> [u8; 16] {
    let mut buf = [0u8; 16];
    rand::rngs::OsRng.fill_bytes(&mut buf);
    buf
}

/// Restricts a file's permissions to owner-only read/write on Unix-like systems.
///
/// NOTE: this is not implemented for Windows. On Windows, equivalent protection
/// would require setting an explicit ACL on the file, which is not done here.
/// This is a known gap, not a fixed issue.
#[cfg(unix)]
fn restrict_file_permissions(path: &Path) -> Result<(), String> {
    use std::os::unix::fs::PermissionsExt;
    let perms = fs::Permissions::from_mode(0o600);
    fs::set_permissions(path, perms)
        .map_err(|e| format!("Could not restrict permissions on {:?}: {}", path, e))
}

#[cfg(not(unix))]
fn restrict_file_permissions(_path: &Path) -> Result<(), String> {
    Ok(())
}

/// Gets or generates the Argon2 salt used to derive the Stronghold password key.
fn get_or_create_argon2_salt() -> Result<[u8; 16], String> {
    let storage_path = get_storage_path()?;
    let salt_file_path = Path::new(&storage_path).join("argon2.salt");

    let keyring_result = Entry::new(SERVICE_NAME, SALT_KEY_NAME)
        .map_err(|e| e.to_string())
        .and_then(|entry| entry.get_password().map_err(|e| e.to_string()));

    if let Ok(hex_salt) = keyring_result {
        if let Ok(decoded) = hex::decode(&hex_salt) {
            if decoded.len() == 16 {
                let mut s = [0u8; 16];
                s.copy_from_slice(&decoded);
                let _ = fs::write(&salt_file_path, &s);
                let _ = restrict_file_permissions(&salt_file_path);
                return Ok(s);
            }
        }
        return Err("Salt length stored in keychain is corrupted".into());
    }

    if salt_file_path.exists() {
        let file_bytes = fs::read(&salt_file_path)
            .map_err(|e| format!("Could not read local argon2.salt: {}", e))?;
        if file_bytes.len() == 16 {
            let mut s = [0u8; 16];
            s.copy_from_slice(&file_bytes);
            if let Ok(entry) = Entry::new(SERVICE_NAME, SALT_KEY_NAME) {
                let _ = entry.set_password(&hex::encode(s));
            }
            return Ok(s);
        }
        return Err("Backup salt file argon2.salt is corrupted".into());
    }

    println!("[Rust] First run: generating a new Argon2 salt...");
    let new_salt = generate_random_bytes_16();

    fs::write(&salt_file_path, &new_salt)
        .map_err(|e| format!("Could not save argon2.salt: {}", e))?;
    restrict_file_permissions(&salt_file_path)?;

    if let Ok(entry) = Entry::new(SERVICE_NAME, SALT_KEY_NAME) {
        let _ = entry.set_password(&hex::encode(new_salt));
    }

    Ok(new_salt)
}

/// Retrieves or generates the database encryption key with layered storage
/// (Keychain + AppData file backup + RAM cache).
///
/// KNOWN LIMITATION (not fully fixed): the file backup at `db.key` is written
/// in plaintext. This is an inherent weakness of any local-file fallback: if an
/// attacker has file-system read access, they can read the key regardless of any
/// encryption derived from material available on the same machine, since that
/// material would be reconstructible by the same attacker. What this revision
/// does do is restrict the file's permissions to the owning user (Unix only —
/// see `restrict_file_permissions`), which narrows the attack surface to
/// privilege-escalation or same-user scenarios rather than any local read access.
/// A real fix requires a product decision: either drop the plaintext file
/// fallback entirely (accepting that a Keychain failure blocks the user), or
/// bind the backup to an OS-provided secure-storage primitive rather than a
/// plain file. Neither alternative is implemented here.
/// Generic layered secret storage (Keychain + AppData file backup), used for
/// any independent 32-byte secret this app needs (db encryption key, Stronghold
/// vault password, etc). Each caller MUST pass its own distinct keychain entry
/// name, backup file name, and RAM cache — secrets obtained through separate
/// calls to this function are independently generated and never derived from
/// one another. This is what fixes the "one key reused for two purposes" issue.
///
/// Same known limitation as before regarding the plaintext file backup: see
/// doc comment history / prior review notes. Not re-solved here, only kept
/// consistent across all secrets that use this helper.
fn get_or_create_secret_32(
    keychain_entry_name: &str,
    backup_file_name: &str,
    cache: &'static OnceLock<[u8; 32]>,
    log_label: &str,
) -> Result<[u8; 32], String> {
    if let Some(cached) = cache.get() {
        return Ok(*cached);
    }

    let storage_path = get_storage_path()?;
    let key_file_path = Path::new(&storage_path).join(backup_file_name);

    let keyring_result = Entry::new(SERVICE_NAME, keychain_entry_name)
        .map_err(|e| e.to_string())
        .and_then(|entry| entry.get_password().map_err(|e| e.to_string()));

    let key_bytes: [u8; 32] = match keyring_result {
        Ok(hex_key) => {
            if let Ok(decoded) = hex::decode(&hex_key) {
                if decoded.len() == 32 {
                    let mut k = [0u8; 32];
                    k.copy_from_slice(&decoded);
                    let _ = fs::write(&key_file_path, &k);
                    let _ = restrict_file_permissions(&key_file_path);
                    k
                } else {
                    return Err(format!("{}: key length stored in keychain is corrupted", log_label));
                }
            } else {
                return Err(format!("{}: error decoding hex key from keychain", log_label));
            }
        }
        Err(_) => {
            if key_file_path.exists() {
                let file_bytes = fs::read(&key_file_path)
                    .map_err(|e| format!("{}: could not read local backup file: {}", log_label, e))?;

                if file_bytes.len() == 32 {
                    let mut k = [0u8; 32];
                    k.copy_from_slice(&file_bytes);

                    if let Ok(entry) = Entry::new(SERVICE_NAME, keychain_entry_name) {
                        let _ = entry.set_password(&hex::encode(k));
                    }
                    k
                } else {
                    return Err(format!("{}: backup key file is corrupted", log_label));
                }
            } else {
                println!("[Rust] First run: generating a new secret ({})...", log_label);
                let new_key = generate_random_bytes_32();

                fs::write(&key_file_path, &new_key)
                    .map_err(|e| format!("{}: could not save backup file: {}", log_label, e))?;
                restrict_file_permissions(&key_file_path)?;

                if let Ok(entry) = Entry::new(SERVICE_NAME, keychain_entry_name) {
                    let _ = entry.set_password(&hex::encode(new_key));
                }

                new_key
            }
        }
    };

    let _ = cache.set(key_bytes);

    Ok(key_bytes)
}

/// The database encryption key, passed to the Go/C client via InitClient.
fn get_or_create_db_key() -> Result<[u8; 32], String> {
    get_or_create_secret_32(KEY_NAME, "db.key", &DB_KEY_CACHE, "db key")
}

fn get_or_create_stronghold_key() -> Result<[u8; 32], String> {
    get_or_create_secret_32(
        STRONGHOLD_KEY_NAME,
        "stronghold.key",
        &STRONGHOLD_KEY_CACHE,
        "stronghold key",
    )
}

pub fn internal_init_bloom() -> Result<String, String> {
    let base_url = "https://api.bloomapp.pw/";
    let ws_url = "wss://api.bloomapp.pw/ws";

    let storage_path = get_storage_path()?;
    let db_key = get_or_create_db_key()?;

    println!("[Rust] Initializing Bloom Client at path: {}", storage_path);

    let c_base_url = CString::new(base_url).map_err(|e| e.to_string())?;
    let c_ws_url = CString::new(ws_url).map_err(|e| e.to_string())?;
    let c_storage_path = CString::new(storage_path).map_err(|e| e.to_string())?;

    unsafe {
        let ptr = InitClient(
            c_base_url.as_ptr(),
            c_ws_url.as_ptr(),
            c_storage_path.as_ptr(),
            db_key.as_ptr(),
            db_key.len() as c_int,
        );
        c_to_string_and_free(ptr)
    }
}

// =========================================================================
// Tauri Commands
// =========================================================================

#[tauri::command]
fn get_app_key() -> Result<String, String> {
    let key_bytes = get_or_create_db_key()?;
    Ok(hex::encode(key_bytes))
}

/// CAVEAT (not fully solved): this still crosses IPC into the webview as a
/// plain string, same as get_app_key. The ideal fix — performing all
/// Stronghold read/write operations as Tauri commands entirely in Rust, so
/// this secret never enters JS memory at all — is not implemented here,
/// because it depends on the exact Rust-side API surface of
/// tauri-plugin-stronghold (accessing an already-initialized Stronghold
/// instance from custom commands), which has not been verified against the
/// project's actual plugin version in this session.
#[tauri::command]
fn get_stronghold_key() -> Result<String, String> {
    let key_bytes = get_or_create_stronghold_key()?;
    Ok(hex::encode(key_bytes))
}

#[tauri::command]
fn init_bloom() -> Result<String, String> {
    internal_init_bloom()
}

#[tauri::command]
fn register_user() -> Result<String, String> {
    unsafe {
        let ptr = Register();
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn login_user(recovery_key: String) -> Result<String, String> {
    let c_key = CString::new(recovery_key).map_err(|e| e.to_string())?;
    unsafe {
        let ptr = Login(c_key.as_ptr());
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn restore_session() -> Result<String, String> {
    unsafe {
        let ptr = RestoreSession();
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn clear_credentials() {
    unsafe {
        ClearCredentials();
    }
}

#[tauri::command]
fn get_me() -> Result<String, String> {
    unsafe {
        let ptr = GetMe();
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn search_users(query: String) -> Result<String, String> {
    let c_query = CString::new(query).map_err(|e| e.to_string())?;
    unsafe {
        let ptr = SearchUsers(c_query.as_ptr());
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn get_user(user_id: String) -> Result<String, String> {
    let c_id = CString::new(user_id).map_err(|e| e.to_string())?;
    unsafe {
        let ptr = GetUser(c_id.as_ptr());
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn edit_user(
    username: Option<String>,
    display_name: Option<String>,
    description: Option<String>,
) -> Result<String, String> {
    let has_username = if username.is_some() { 1 } else { 0 };
    let has_display_name = if display_name.is_some() { 1 } else { 0 };
    let has_description = if description.is_some() { 1 } else { 0 };

    let c_username = CString::new(username.unwrap_or_default()).map_err(|e| e.to_string())?;
    let c_display_name = CString::new(display_name.unwrap_or_default()).map_err(|e| e.to_string())?;
    let c_description = CString::new(description.unwrap_or_default()).map_err(|e| e.to_string())?;

    unsafe {
        let ptr = EditUser(
            c_username.as_ptr(),
            c_display_name.as_ptr(),
            c_description.as_ptr(),
            has_username,
            has_display_name,
            has_description,
        );
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn get_chats() -> Result<String, String> {
    unsafe {
        let ptr = GetChats();
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn get_local_chats() -> Result<String, String> {
    unsafe {
        let ptr = GetLocalChats();
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn send_message(chat_id: i32, reply_to_id: i32, content: String) -> Result<String, String> {
    let c_content = CString::new(content).map_err(|e| e.to_string())?;
    unsafe {
        let ptr = SendMessage(chat_id as c_int, reply_to_id as c_int, c_content.as_ptr());
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn load_messages(chat_id: i32, before_id: i32) -> Result<String, String> {
    unsafe {
        let ptr = LoadMessages(chat_id as c_int, before_id as c_int);
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn create_chat(
    user_id: String,
    ml_kem_768_key: String,
    x448_key: String,
    ed448_key: String,
) -> Result<String, String> {
    let c_user_id = CString::new(user_id).map_err(|e| e.to_string())?;
    let c_ml_kem = CString::new(ml_kem_768_key).map_err(|e| e.to_string())?;
    let c_x448 = CString::new(x448_key).map_err(|e| e.to_string())?;
    let c_ed448 = CString::new(ed448_key).map_err(|e| e.to_string())?;

    unsafe {
        let ptr = CreateChat(
            c_user_id.as_ptr(),
            c_ml_kem.as_ptr(),
            c_x448.as_ptr(),
            c_ed448.as_ptr(),
        );
        c_to_string_and_free(ptr)
    }
}

#[tauri::command]
fn gen_mnemonic(key: Vec<u8>) -> Result<String, String> {
    if key.len() != 16 {
        return Err("Key must be 16 byte length".to_string());
    }

    let mnemonic = Mnemonic::from_entropy_in(Language::English, &key)
        .map_err(|e| e.to_string())?;

    Ok(mnemonic.to_string())
}

#[tauri::command]
fn restore_mnemonic(phrase: String) -> Result<Vec<u8>, String> {
    let mnemonic = Mnemonic::parse(phrase.trim()).map_err(|e| e.to_string())?;

    let entropy = mnemonic.to_entropy();

    if entropy.len() != 16 {
        return Err("Phrase doesn't contains 16 bytes of entropy".to_string());
    }

    Ok(entropy.to_vec())
}

// =========================================================================
// Tauri application initialization
// =========================================================================

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_app_key,
            get_stronghold_key,
            init_bloom,
            register_user,
            login_user,
            restore_session,
            clear_credentials,
            get_me,
            search_users,
            get_user,
            edit_user,
            get_chats,
            get_local_chats,
            send_message,
            load_messages,
            create_chat,
            gen_mnemonic,
            restore_mnemonic
        ])
        .plugin(
            tauri_plugin_stronghold::Builder::new(move |password| {
                let mut output_key = [0u8; 32];

                let salt = get_or_create_argon2_salt()
                    .expect("Failed to obtain Argon2 salt");

                Argon2::default()
                    .hash_password_into(password.as_bytes(), &salt, &mut output_key)
                    .expect("Argon2 hashing error");

                output_key.to_vec()
            }).build()
        )
        .setup(|app| {
            match internal_init_bloom() {
                Ok(status) => println!("[Rust] Bloom Client initialized: {}", status),
                Err(err) => eprintln!("[Rust] Bloom Client init error: {}", err),
            }

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            if let Some(window) = app.get_webview_window("main") {
                #[cfg(target_os = "windows")]
                let _ = window.set_decorations(false);
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
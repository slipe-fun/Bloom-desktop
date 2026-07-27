use directories::ProjectDirs;
use keyring::Entry;
use rand::RngCore;
use std::fs;
use std::path::Path;
use std::sync::OnceLock;

const SERVICE_NAME: &str = "pw.bloomapp.desktop";
const KEY_NAME: &str = "db_encryption_key";
const SALT_KEY_NAME: &str = "argon2_salt";
const STRONGHOLD_KEY_NAME: &str = "stronghold_vault_key";

static DB_KEY_CACHE: OnceLock<[u8; 32]> = OnceLock::new();
static STRONGHOLD_KEY_CACHE: OnceLock<[u8; 32]> = OnceLock::new();

pub fn get_storage_path() -> Result<String, String> {
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

pub fn get_or_create_argon2_salt() -> Result<[u8; 16], String> {
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

pub fn get_or_create_db_key() -> Result<[u8; 32], String> {
    get_or_create_secret_32(KEY_NAME, "db.key", &DB_KEY_CACHE, "db key")
}

pub fn get_or_create_stronghold_key() -> Result<[u8; 32], String> {
    get_or_create_secret_32(
        STRONGHOLD_KEY_NAME,
        "stronghold.key",
        &STRONGHOLD_KEY_CACHE,
        "stronghold key",
    )
}
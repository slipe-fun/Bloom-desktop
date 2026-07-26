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

const SERVICE_NAME: &str = "pw.ephmrl.bloom.desktop";
const KEY_NAME: &str = "db_encryption_key";
const SALT_KEY_NAME: &str = "argon2_salt";

static DB_KEY_CACHE: OnceLock<[u8; 32]> = OnceLock::new();

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
    pub fn Login(recovery_key: *const c_char) -> *mut c_char;
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

fn get_or_create_db_key() -> Result<[u8; 32], String> {
    if let Some(cached_key) = DB_KEY_CACHE.get() {
        return Ok(*cached_key);
    }

    let storage_path = get_storage_path()?;
    let key_file_path = Path::new(&storage_path).join("db.key");

    let keyring_result = Entry::new(SERVICE_NAME, KEY_NAME)
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
                    return Err("Key length stored in keychain is corrupted".into());
                }
            } else {
                return Err("Error decoding hex key from keychain".into());
            }
        }
        Err(_) => {
            if key_file_path.exists() {
                let file_bytes = fs::read(&key_file_path)
                    .map_err(|e| format!("Could not read local db.key: {}", e))?;

                if file_bytes.len() == 32 {
                    let mut k = [0u8; 32];
                    k.copy_from_slice(&file_bytes);

                    if let Ok(entry) = Entry::new(SERVICE_NAME, KEY_NAME) {
                        let _ = entry.set_password(&hex::encode(k));
                    }
                    k
                } else {
                    return Err("Backup key file db.key is corrupted".into());
                }
            } else {
                println!("[Rust] First run: generating a new master key...");
                let new_key = generate_random_bytes_32();

                fs::write(&key_file_path, &new_key)
                    .map_err(|e| format!("Could not save db.key: {}", e))?;
                restrict_file_permissions(&key_file_path)?;

                if let Ok(entry) = Entry::new(SERVICE_NAME, KEY_NAME) {
                    let _ = entry.set_password(&hex::encode(new_key));
                }

                new_key
            }
        }
    };

    let _ = DB_KEY_CACHE.set(key_bytes);

    Ok(key_bytes)
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

// =========================================================================
// Tauri application initialization
// =========================================================================

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_app_key,
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
            create_chat
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
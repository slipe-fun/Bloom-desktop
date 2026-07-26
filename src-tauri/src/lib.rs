use rand::RngCore;
use std::ffi::{CStr, CString};
use std::fs;
use std::os::raw::{c_char, c_int, c_uchar};
use std::path::Path;
use tauri::Manager;

// Подключаем системную библиотеку MSVC для поддержки fprintf в FFI (на случай, если нет в build.rs)
#[cfg(target_os = "windows")]
#[link(name = "legacy_stdio_definitions")]
extern "C" {}

// -----------------------------------------------------------------------------
// 1. FFI Биндинги к libbloom.a
// -----------------------------------------------------------------------------
pub type ChatsCallback = Option<unsafe extern "C" fn(json_data: *const c_char)>;
pub type MessagesCallback = Option<unsafe extern "C" fn(json_data: *const c_char)>;

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

/// Чтение C-строки и очистка памяти Go через FreeString
pub unsafe fn c_to_string_and_free(ptr: *mut c_char) -> Result<String, String> {
    if ptr.is_null() {
        return Ok("OK".to_string());
    }
    let c_str = CStr::from_ptr(ptr);
    let result = c_str.to_str().map_err(|e| e.to_string())?.to_string();
    FreeString(ptr);

    if result.contains("error") {
        Err(result)
    } else {
        Ok(result)
    }
}

// -----------------------------------------------------------------------------
// 2. Внутренняя функция логики инициализации Bloom в Rust
// -----------------------------------------------------------------------------
fn generate_crypto_key_32() -> [u8; 32] {
    let mut key = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut key);
    key
}

fn get_or_create_db_key(storage_dir: &str) -> Result<[u8; 32], String> {
    fs::create_dir_all(storage_dir)
        .map_err(|e| format!("Не удалось создать папку хранилища: {}", e))?;

    let key_file_path = Path::new(storage_dir).join("db.key");

    if key_file_path.exists() {
        let key_bytes = fs::read(&key_file_path)
            .map_err(|e| format!("Не удалось прочитать файл ключа: {}", e))?;

        if key_bytes.len() != 32 {
            return Err("Файл ключа поврежден (длина должна быть 32 байта)".into());
        }

        let mut key = [0u8; 32];
        key.copy_from_slice(&key_bytes);
        Ok(key)
    } else {
        let new_key = generate_crypto_key_32();
        fs::write(&key_file_path, new_key)
            .map_err(|e| format!("Не удалось сохранить ключ в файл: {}", e))?;
        Ok(new_key)
    }
}

/// Функция инициализации клиента (вызывается из Rust при старте или из React через command)
pub fn internal_init_bloom() -> Result<String, String> {
    let base_url = "https://api.bloomapp.pw/";
    let ws_url = "wss://api.bloomapp.pw/ws";
    let storage_path = "./storage";

    let db_key = get_or_create_db_key(storage_path)?;

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

// -----------------------------------------------------------------------------
// 3. Tauri Command (для React)
// -----------------------------------------------------------------------------
#[tauri::command]
fn init_bloom() -> Result<String, String> {
    internal_init_bloom()
}

// -----------------------------------------------------------------------------
// 4. Главная точка запуска Rust
// -----------------------------------------------------------------------------
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![init_bloom])
        .setup(|app| {
            // ИНИЦИАЛИЗАЦИЯ КЛИЕНТА ПРЯМО В RUST ПРИ СТАРТЕ ПРИЛОЖЕНИЯ
            match internal_init_bloom() {
                Ok(status) => println!("[Rust] Bloom Client успешно инициализирован: {}", status),
                Err(err) => eprintln!("[Rust] Ошибка инициализации Bloom Client: {}", err),
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
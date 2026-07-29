use std::ffi::{c_char, c_int, c_uchar, CStr};

#[cfg(target_os = "windows")]
#[link(name = "legacy_stdio_definitions")]
extern "C" {}

pub type ChatsCallback = Option<unsafe extern "C" fn(json_data: *const c_char)>;
pub type MessagesCallback = Option<unsafe extern "C" fn(json_data: *const c_char)>;
pub type UserCallback = Option<unsafe extern "C" fn(json_data: *const c_char)>;

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
    pub fn GetOrFetchMe() -> *mut c_char;
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
    pub fn RegisterUserCallback(cb: UserCallback);
    pub fn UnregisterUserCallback();
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
        return false;
    }
    result.contains("error")
}

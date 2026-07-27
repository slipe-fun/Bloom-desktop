#![allow(non_snake_case)]

use crate::ffi;
use std::ffi::CString;

#[tauri::command]
pub fn register_user() -> Result<String, String> {
    unsafe {
        let ptr = ffi::Register();
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn login_user(recoveryKey: String) -> Result<String, String> {
    let c_key = CString::new(recoveryKey).map_err(|e| e.to_string())?;
    unsafe {
        let ptr = ffi::Login(c_key.as_ptr());
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn restore_session() -> Result<String, String> {
    unsafe {
        let ptr = ffi::RestoreSession();
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn clear_credentials() {
    unsafe {
        ffi::ClearCredentials();
    }
}
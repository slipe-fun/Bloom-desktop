#![allow(non_snake_case)]

use crate::ffi;
use std::ffi::CString;

#[tauri::command]
pub fn registerUser() -> Result<String, String> {
    unsafe {
        let ptr = ffi::Register();
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn loginUser(recoveryKey: String) -> Result<String, String> {
    let c_key = CString::new(recoveryKey).map_err(|e| e.to_string())?;
    unsafe {
        let ptr = ffi::Login(c_key.as_ptr());
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn restoreSession() -> Result<String, String> {
    unsafe {
        let ptr = ffi::RestoreSession();
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn clearCredentials() {
    unsafe {
        ffi::ClearCredentials();
    }
}
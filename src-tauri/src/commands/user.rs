#![allow(non_snake_case)]

use crate::ffi;
use std::ffi::CString;

#[tauri::command]
pub fn getMe() -> Result<String, String> {
    unsafe {
        let ptr = ffi::GetMe();
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn searchUsers(query: String) -> Result<String, String> {
    let c_query = CString::new(query).map_err(|e| e.to_string())?;
    unsafe {
        let ptr = ffi::SearchUsers(c_query.as_ptr());
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn getUser(userId: String) -> Result<String, String> {
    let c_id = CString::new(userId).map_err(|e| e.to_string())?;
    unsafe {
        let ptr = ffi::GetUser(c_id.as_ptr());
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn editUser(
    username: Option<String>,
    displayName: Option<String>,
    description: Option<String>,
) -> Result<String, String> {
    let has_username = if username.is_some() { 1 } else { 0 };
    let has_display_name = if displayName.is_some() { 1 } else { 0 };
    let has_description = if description.is_some() { 1 } else { 0 };

    let c_username = CString::new(username.unwrap_or_default()).map_err(|e| e.to_string())?;
    let c_display_name = CString::new(displayName.unwrap_or_default()).map_err(|e| e.to_string())?;
    let c_description = CString::new(description.unwrap_or_default()).map_err(|e| e.to_string())?;

    unsafe {
        let ptr = ffi::EditUser(
            c_username.as_ptr(),
            c_display_name.as_ptr(),
            c_description.as_ptr(),
            has_username,
            has_display_name,
            has_description,
        );
        ffi::c_to_string_and_free(ptr)
    }
}
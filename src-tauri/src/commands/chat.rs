#![allow(non_snake_case)]

use crate::ffi;
use std::ffi::{CString, c_int};

#[tauri::command]
pub fn getChats() -> Result<String, String> {
    unsafe {
        let ptr = ffi::GetChats();
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn getLocalChats() -> Result<String, String> {
    unsafe {
        let ptr = ffi::GetLocalChats();
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn sendMessage(chatId: i32, replyToId: i32, content: String) -> Result<String, String> {
    let c_content = CString::new(content).map_err(|e| e.to_string())?;
    unsafe {
        let ptr = ffi::SendMessage(chatId as c_int, replyToId as c_int, c_content.as_ptr());
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn loadMessages(chatId: i32, beforeId: i32) -> Result<String, String> {
    unsafe {
        let ptr = ffi::LoadMessages(chatId as c_int, beforeId as c_int);
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn createChat(
    userId: String,
    mlKem768Key: String,
    x448Key: String,
    ed448Key: String,
) -> Result<String, String> {
    let c_user_id = CString::new(userId).map_err(|e| e.to_string())?;
    let c_ml_kem = CString::new(mlKem768Key).map_err(|e| e.to_string())?;
    let c_x448 = CString::new(x448Key).map_err(|e| e.to_string())?;
    let c_ed448 = CString::new(ed448Key).map_err(|e| e.to_string())?;

    unsafe {
        let ptr = ffi::CreateChat(
            c_user_id.as_ptr(),
            c_ml_kem.as_ptr(),
            c_x448.as_ptr(),
            c_ed448.as_ptr(),
        );
        ffi::c_to_string_and_free(ptr)
    }
}
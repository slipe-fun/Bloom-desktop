pub mod auth;
pub mod chat;
pub mod crypto;
pub mod user;

use crate::{ffi, security};
use std::ffi::{CString, c_int};

pub fn internal_init_bloom() -> Result<String, String> {
    let base_url = "https://api.bloomapp.pw/";
    let ws_url = "wss://api.bloomapp.pw/ws";

    let storage_path = security::get_storage_path()?;
    let db_key = security::get_or_create_db_key()?;

    println!("[Rust] Initializing Bloom Client at path: {}", storage_path);

    let c_base_url = CString::new(base_url).map_err(|e| e.to_string())?;
    let c_ws_url = CString::new(ws_url).map_err(|e| e.to_string())?;
    let c_storage_path = CString::new(storage_path).map_err(|e| e.to_string())?;

    unsafe {
        let ptr = ffi::InitClient(
            c_base_url.as_ptr(),
            c_ws_url.as_ptr(),
            c_storage_path.as_ptr(),
            db_key.as_ptr(),
            db_key.len() as c_int,
        );
        ffi::c_to_string_and_free(ptr)
    }
}

#[tauri::command]
pub fn init_bloom() -> Result<String, String> {
    internal_init_bloom()
}
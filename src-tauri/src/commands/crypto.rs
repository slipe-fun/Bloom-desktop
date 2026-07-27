#![allow(non_snake_case)]

use crate::security;
use bip39::{Language, Mnemonic};

#[tauri::command]
pub fn get_app_key() -> Result<String, String> {
    let key_bytes = security::get_or_create_db_key()?;
    Ok(hex::encode(key_bytes))
}

#[tauri::command]
pub fn get_stronghold_key() -> Result<String, String> {
    let key_bytes = security::get_or_create_stronghold_key()?;
    Ok(hex::encode(key_bytes))
}

#[tauri::command]
pub fn gen_mnemonic(key: Vec<u8>) -> Result<String, String> {
    if key.len() != 16 {
        return Err("Key must be 16 byte length".to_string());
    }

    let mnemonic = Mnemonic::from_entropy_in(Language::English, &key)
        .map_err(|e| e.to_string())?;

    Ok(mnemonic.to_string())
}

#[tauri::command]
pub fn restore_mnemonic(phrase: String) -> Result<Vec<u8>, String> {
    let mnemonic = Mnemonic::parse(phrase.trim()).map_err(|e| e.to_string())?;

    let entropy = mnemonic.to_entropy();

    if entropy.len() != 16 {
        return Err("Phrase doesn't contains 16 bytes of entropy".to_string());
    }

    Ok(entropy.to_vec())
}
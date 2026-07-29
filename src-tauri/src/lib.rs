#![allow(non_snake_case)]

mod commands;
mod ffi;
mod security;

use argon2::Argon2;
use std::ffi::CStr;
use std::sync::OnceLock;
use tauri::Emitter;
use tauri::Manager;

static APP_HANDLE: OnceLock<tauri::AppHandle> = OnceLock::new();

pub unsafe extern "C" fn chats_callback_handler(json_data: *const std::os::raw::c_char) {
    if json_data.is_null() {
        return;
    }
    if let Ok(c_str) = CStr::from_ptr(json_data).to_str() {
        if let Some(handle) = APP_HANDLE.get() {
            let _ = handle.emit("chats-updated", c_str);
        }
    }
}

pub unsafe extern "C" fn messages_callback_handler(json_data: *const std::os::raw::c_char) {
    if json_data.is_null() {
        return;
    }
    if let Ok(c_str) = CStr::from_ptr(json_data).to_str() {
        if let Some(handle) = APP_HANDLE.get() {
            let _ = handle.emit("message-new", c_str);
        }
    }
}

pub unsafe extern "C" fn user_callback_handler(json_data: *const std::os::raw::c_char) {
    if json_data.is_null() {
        return;
    }
    if let Ok(c_str) = CStr::from_ptr(json_data).to_str() {
        if let Some(handle) = APP_HANDLE.get() {
            let _ = handle.emit("user-updated", c_str);
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::crypto::getAppKey,
            commands::crypto::getStrongholdKey,
            commands::initBloom,
            commands::auth::registerUser,
            commands::auth::loginUser,
            commands::auth::restoreSession,
            commands::auth::clearCredentials,
            commands::user::getMe,
            commands::user::getOrFetchMe,
            commands::user::searchUsers,
            commands::user::getUser,
            commands::user::editUser,
            commands::chat::getChats,
            commands::chat::getLocalChats,
            commands::chat::sendMessage,
            commands::chat::loadMessages,
            commands::chat::createChat,
            commands::crypto::genMnemonic,
            commands::crypto::restoreMnemonic
        ])
        .plugin(
            tauri_plugin_stronghold::Builder::new(move |password| {
                let mut output_key = [0u8; 32];

                let salt =
                    security::get_or_create_argon2_salt().expect("Failed to obtain Argon2 salt");

                Argon2::default()
                    .hash_password_into(password.as_bytes(), &salt, &mut output_key)
                    .expect("Argon2 hashing error");

                output_key.to_vec()
            })
            .build(),
        )
        .setup(|app| {
            let _ = APP_HANDLE.set(app.handle().clone());

            match commands::internalInitBloom() {
                Ok(status) => println!("[Rust] Bloom Client initialized: {}", status),
                Err(err) => eprintln!("[Rust] Bloom Client init error: {}", err),
            }

            unsafe {
                ffi::RegisterChatsCallback(Some(chats_callback_handler));
                ffi::RegisterMessagesCallback(Some(messages_callback_handler));
                ffi::RegisterUserCallback(Some(user_callback_handler));
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

#![allow(non_snake_case)]

mod commands;
mod ffi;
mod security;

use argon2::Argon2;
use tauri::Manager;

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

                let salt = security::get_or_create_argon2_salt()
                    .expect("Failed to obtain Argon2 salt");

                Argon2::default()
                    .hash_password_into(password.as_bytes(), &salt, &mut output_key)
                    .expect("Argon2 hashing error");

                output_key.to_vec()
            }).build()
        )
        .setup(|app| {
            match commands::internalInitBloom() {
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
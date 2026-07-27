mod commands;
mod ffi;
mod security;

use argon2::Argon2;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::crypto::get_app_key,
            commands::crypto::get_stronghold_key,
            commands::init_bloom,
            commands::auth::register_user,
            commands::auth::login_user,
            commands::auth::restore_session,
            commands::auth::clear_credentials,
            commands::user::get_me,
            commands::user::search_users,
            commands::user::get_user,
            commands::user::edit_user,
            commands::chat::get_chats,
            commands::chat::get_local_chats,
            commands::chat::send_message,
            commands::chat::load_messages,
            commands::chat::create_chat,
            commands::crypto::gen_mnemonic,
            commands::crypto::restore_mnemonic
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
            match commands::internal_init_bloom() {
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
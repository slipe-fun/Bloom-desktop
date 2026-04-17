mod crypto;
mod error;
mod secure_storage;

use secure_storage::{
    MessageQueryInput, MessageRecord, MessageUpsertInput, SecretDescriptor, SecureStorageState,
    SecurityStatus,
};
use tauri::{Manager, State};

type CommandResult<T> = Result<T, String>;

#[tauri::command]
fn secure_storage_status(state: State<'_, SecureStorageState>) -> CommandResult<SecurityStatus> {
    state.status().map_err(|error| error.to_string())
}

#[tauri::command]
fn secure_storage_initialize(
    state: State<'_, SecureStorageState>,
    password: String,
) -> CommandResult<SecurityStatus> {
    state
        .initialize(&password)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn secure_storage_unlock(
    state: State<'_, SecureStorageState>,
    password: String,
) -> CommandResult<SecurityStatus> {
    state.unlock(&password).map_err(|error| error.to_string())
}

#[tauri::command]
fn secure_storage_lock(state: State<'_, SecureStorageState>) -> CommandResult<()> {
    state.lock().map_err(|error| error.to_string())
}

#[tauri::command]
fn secure_storage_pbkdf2(
    state: State<'_, SecureStorageState>,
    password: String,
    salt_b64: Option<String>,
    iterations: Option<u32>,
    dk_len: Option<usize>,
) -> CommandResult<crypto::Pbkdf2Response> {
    state
        .derive_password_key(&password, salt_b64, iterations, dk_len)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn messages_upsert(
    state: State<'_, SecureStorageState>,
    message: MessageUpsertInput,
) -> CommandResult<MessageRecord> {
    state
        .upsert_message(message)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn messages_get_by_chat(
    state: State<'_, SecureStorageState>,
    query: MessageQueryInput,
) -> CommandResult<Vec<MessageRecord>> {
    state
        .get_messages_by_chat(query)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn messages_get_by_id(
    state: State<'_, SecureStorageState>,
    id: String,
) -> CommandResult<Option<MessageRecord>> {
    state
        .get_message_by_id(id)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn messages_get_by_server_id(
    state: State<'_, SecureStorageState>,
    server_id: i64,
) -> CommandResult<Option<MessageRecord>> {
    state
        .get_message_by_server_id(server_id)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn messages_mark_seen(
    state: State<'_, SecureStorageState>,
    id: Option<String>,
    server_id: Option<i64>,
    seen: Option<i64>,
) -> CommandResult<Option<MessageRecord>> {
    state
        .mark_message_seen(id, server_id, seen)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn messages_delete(state: State<'_, SecureStorageState>, id: String) -> CommandResult<bool> {
    state.delete_message(id).map_err(|error| error.to_string())
}

#[tauri::command]
fn vault_set_secret(
    state: State<'_, SecureStorageState>,
    namespace: String,
    name: String,
    value_b64: String,
) -> CommandResult<()> {
    state
        .set_secret(namespace, name, value_b64)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn vault_get_secret(
    state: State<'_, SecureStorageState>,
    namespace: String,
    name: String,
) -> CommandResult<Option<String>> {
    state
        .get_secret(namespace, name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn vault_delete_secret(
    state: State<'_, SecureStorageState>,
    namespace: String,
    name: String,
) -> CommandResult<bool> {
    state
        .delete_secret(namespace, name)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn vault_list_secrets(
    state: State<'_, SecureStorageState>,
    namespace: Option<String>,
) -> CommandResult<Vec<SecretDescriptor>> {
    state
        .list_secrets(namespace)
        .map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let secure_storage = SecureStorageState::new(app.path().app_data_dir()?)?;
            app.manage(secure_storage);
            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            secure_storage_status,
            secure_storage_initialize,
            secure_storage_unlock,
            secure_storage_lock,
            secure_storage_pbkdf2,
            messages_upsert,
            messages_get_by_chat,
            messages_get_by_id,
            messages_get_by_server_id,
            messages_mark_seen,
            messages_delete,
            vault_set_secret,
            vault_get_secret,
            vault_delete_secret,
            vault_list_secrets,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

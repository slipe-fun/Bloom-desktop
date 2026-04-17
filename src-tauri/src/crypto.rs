use aes_gcm_siv::{
    aead::{Aead, KeyInit},
    Aes256GcmSiv, Nonce,
};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use pbkdf2::pbkdf2_hmac;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::error::{AppError, AppResult};

pub const DEFAULT_PBKDF2_ITERATIONS: u32 = 600_000;
pub const DEFAULT_PBKDF2_DK_LEN: usize = 32;
pub const DEFAULT_SALT_LEN: usize = 16;
pub const DEFAULT_KEY_LEN: usize = 32;
pub const AES_NONCE_LEN: usize = 12;

#[derive(Debug, Clone)]
pub struct EncryptedBytes {
    pub ciphertext: Vec<u8>,
    pub nonce: [u8; AES_NONCE_LEN],
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WrappedKey {
    pub ciphertext_b64: String,
    pub nonce_b64: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Pbkdf2Response {
    pub hash_b64: String,
    pub salt_b64: String,
    pub iterations: u32,
    pub dk_len: usize,
}

pub fn random_bytes(len: usize) -> AppResult<Vec<u8>> {
    let mut output = vec![0_u8; len];
    getrandom::fill(&mut output).map_err(|error| AppError::Random(error.to_string()))?;
    Ok(output)
}

pub fn derive_pbkdf2(password: &str, salt: &[u8], iterations: u32, dk_len: usize) -> Vec<u8> {
    let mut derived = vec![0_u8; dk_len];
    pbkdf2_hmac::<Sha256>(password.as_bytes(), salt, iterations, &mut derived);
    derived
}

pub fn pbkdf2_response(
    password: &str,
    salt: Option<Vec<u8>>,
    iterations: u32,
    dk_len: usize,
) -> AppResult<Pbkdf2Response> {
    let salt = match salt {
        Some(existing) => existing,
        None => random_bytes(DEFAULT_SALT_LEN)?,
    };
    let hash = derive_pbkdf2(password, &salt, iterations, dk_len);

    Ok(Pbkdf2Response {
        hash_b64: BASE64.encode(hash),
        salt_b64: BASE64.encode(salt),
        iterations,
        dk_len,
    })
}

pub fn encrypt_bytes(key: &[u8], plaintext: &[u8]) -> AppResult<EncryptedBytes> {
    if key.len() != DEFAULT_KEY_LEN {
        return Err(AppError::InvalidArgument(
            "AES-256-GCM-SIV expects a 32-byte key".into(),
        ));
    }

    let nonce_bytes = random_bytes(AES_NONCE_LEN)?;
    let mut nonce = [0_u8; AES_NONCE_LEN];
    nonce.copy_from_slice(&nonce_bytes);

    let cipher = Aes256GcmSiv::new_from_slice(key).map_err(|_| AppError::Crypto)?;
    let ciphertext = cipher
        .encrypt(Nonce::from_slice(&nonce), plaintext)
        .map_err(|_| AppError::Crypto)?;

    Ok(EncryptedBytes { ciphertext, nonce })
}

pub fn decrypt_bytes(key: &[u8], ciphertext: &[u8], nonce: &[u8]) -> AppResult<Vec<u8>> {
    if key.len() != DEFAULT_KEY_LEN {
        return Err(AppError::InvalidArgument(
            "AES-256-GCM-SIV expects a 32-byte key".into(),
        ));
    }

    if nonce.len() != AES_NONCE_LEN {
        return Err(AppError::InvalidArgument(
            "AES-256-GCM-SIV expects a 12-byte nonce".into(),
        ));
    }

    let cipher = Aes256GcmSiv::new_from_slice(key).map_err(|_| AppError::Crypto)?;
    cipher
        .decrypt(Nonce::from_slice(nonce), ciphertext)
        .map_err(|_| AppError::InvalidPassword)
}

pub fn wrap_key(key_encryption_key: &[u8], key_to_wrap: &[u8]) -> AppResult<WrappedKey> {
    let encrypted = encrypt_bytes(key_encryption_key, key_to_wrap)?;

    Ok(WrappedKey {
        ciphertext_b64: BASE64.encode(encrypted.ciphertext),
        nonce_b64: BASE64.encode(encrypted.nonce),
    })
}

pub fn unwrap_key(key_encryption_key: &[u8], wrapped_key: &WrappedKey) -> AppResult<Vec<u8>> {
    let ciphertext = BASE64.decode(&wrapped_key.ciphertext_b64)?;
    let nonce = BASE64.decode(&wrapped_key.nonce_b64)?;

    decrypt_bytes(key_encryption_key, &ciphertext, &nonce)
}

pub fn namespace_locator(vault_key: &[u8], namespace: &str) -> String {
    keyed_hash(vault_key, b"namespace", &[namespace.as_bytes()])
}

pub fn secret_locator(vault_key: &[u8], namespace: &str, name: &str) -> String {
    keyed_hash(
        vault_key,
        b"secret",
        &[namespace.as_bytes(), name.as_bytes()],
    )
}

fn keyed_hash(key: &[u8], scope: &[u8], parts: &[&[u8]]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(b"bloom-secure-storage-v1");
    hasher.update([0_u8]);
    hasher.update(scope);
    hasher.update([0_u8]);
    hasher.update(key);

    for part in parts {
        hasher.update([0_u8]);
        hasher.update(part);
    }

    hex::encode(hasher.finalize())
}

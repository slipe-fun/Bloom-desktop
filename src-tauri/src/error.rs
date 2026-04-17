use thiserror::Error;

pub type AppResult<T> = Result<T, AppError>;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("secure storage is already initialized")]
    AlreadyInitialized,
    #[error("secure storage is not initialized")]
    NotInitialized,
    #[error("secure storage is locked")]
    Locked,
    #[error("invalid password or corrupted secure storage metadata")]
    InvalidPassword,
    #[error("invalid argument: {0}")]
    InvalidArgument(String),
    #[error("encryption or decryption failed")]
    Crypto,
    #[error("application state is unavailable")]
    StatePoisoned,
    #[error("random generator failed: {0}")]
    Random(String),
    #[error("i/o error: {0}")]
    Io(#[from] std::io::Error),
    #[error("database error: {0}")]
    Sqlite(#[from] rusqlite::Error),
    #[error("serialization error: {0}")]
    SerdeJson(#[from] serde_json::Error),
    #[error("base64 decode error: {0}")]
    Base64(#[from] base64::DecodeError),
}

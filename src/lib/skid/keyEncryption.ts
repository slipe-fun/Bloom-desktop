import { gcmsiv } from '@noble/ciphers/aes.js'
import type { Cipher } from '@noble/ciphers/utils.js'
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { randomBytes } from '@noble/hashes/utils.js'
import type { KDFInput } from '@noble/hashes/utils.js'
import bytesToBase64 from './utils/bytesToBase64'
import base64ToBytes from './utils/base64ToBytes'

interface HashedPassword {
  hash: Uint8Array
  salt: Uint8Array
}

interface EncryptedKeys {
  ciphertext: string
  nonce: string
}

interface ChatKeys {
  id: number
  key: string
}

export async function hashPassword(password: KDFInput, salt?: Uint8Array): Promise<HashedPassword> {
  const _salt: Uint8Array = salt ? salt : randomBytes(16)
  const hash = await pbkdf2Async(sha256, password, _salt, {
    c: 600000,
    dkLen: 32,
  })

  return {
    hash,
    salt: _salt,
  }
}

export function encryptKeys(key: Uint8Array, content: Uint8Array): EncryptedKeys {
  const nonce: Uint8Array = randomBytes(12)
  const aes: Cipher = gcmsiv(key, nonce)
  const ciphertext: Uint8Array = aes.encrypt(content)

  return {
    ciphertext: bytesToBase64(ciphertext),
    nonce: bytesToBase64(nonce),
  }
}

export function decryptKeys(key: Uint8Array, ciphertext: string, nonce: string): ChatKeys[] | null {
  const aes: Cipher = gcmsiv(key, base64ToBytes(nonce))
  const decrypted: Uint8Array = aes.decrypt(base64ToBytes(ciphertext))
  const decoded: string = new TextDecoder().decode(decrypted)

  try {
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

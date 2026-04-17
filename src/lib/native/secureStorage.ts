import { invoke } from '@tauri-apps/api/core'
import bytesToBase64 from '../skid/utils/bytesToBase64'
import base64ToBytes from '../skid/utils/base64ToBytes'

export interface SecurityStatus {
  initialized: boolean
  unlocked: boolean
  storagePath: string
}

export interface Pbkdf2Result {
  hashB64: string
  saltB64: string
  iterations: number
  dkLen: number
}

export interface MessageRecord {
  id: string
  serverId: number
  chatId: number
  content: string
  authorId: number
  date: number
  seen?: number | null
  nonce?: string | null
  replyToId?: string | null
}

export interface MessageInput {
  id?: string
  serverId: number
  chatId: number
  content: string
  authorId: number
  date: number
  seen?: number | null
  nonce?: string | null
  replyToId?: string | null
}

export interface MessageQuery {
  chatId: number
  limit?: number
  beforeDate?: number
}

export interface SecretDescriptor {
  namespace: string
  name: string
  createdAt: number
  updatedAt: number
}

function encodeSecretValue(value: string | Uint8Array): string {
  if (typeof value === 'string') {
    return bytesToBase64(new TextEncoder().encode(value))
  }

  return bytesToBase64(value)
}

export async function getSecureStorageStatus(): Promise<SecurityStatus> {
  return invoke<SecurityStatus>('secure_storage_status')
}

export async function initializeSecureStorage(password: string): Promise<SecurityStatus> {
  return invoke<SecurityStatus>('secure_storage_initialize', { password })
}

export async function unlockSecureStorage(password: string): Promise<SecurityStatus> {
  return invoke<SecurityStatus>('secure_storage_unlock', { password })
}

export async function lockSecureStorage(): Promise<void> {
  return invoke('secure_storage_lock')
}

export async function derivePbkdf2Key(params: {
  password: string
  salt?: Uint8Array
  iterations?: number
  dkLen?: number
}): Promise<Pbkdf2Result> {
  return invoke<Pbkdf2Result>('secure_storage_pbkdf2', {
    password: params.password,
    saltB64: params.salt ? bytesToBase64(params.salt) : null,
    iterations: params.iterations ?? null,
    dkLen: params.dkLen ?? null,
  })
}

export async function upsertMessage(message: MessageInput): Promise<MessageRecord> {
  return invoke<MessageRecord>('messages_upsert', { message })
}

export async function getMessagesByChat(query: MessageQuery): Promise<MessageRecord[]> {
  return invoke<MessageRecord[]>('messages_get_by_chat', { query })
}

export async function getMessageById(id: string): Promise<MessageRecord | null> {
  return invoke<MessageRecord | null>('messages_get_by_id', { id })
}

export async function getMessageByServerId(serverId: number): Promise<MessageRecord | null> {
  return invoke<MessageRecord | null>('messages_get_by_server_id', { serverId })
}

export async function markMessageSeen(params: {
  id?: string
  serverId?: number
  seen?: number | null
}): Promise<MessageRecord | null> {
  return invoke<MessageRecord | null>('messages_mark_seen', {
    id: params.id ?? null,
    serverId: params.serverId ?? null,
    seen: params.seen ?? null,
  })
}

export async function deleteMessage(id: string): Promise<boolean> {
  return invoke<boolean>('messages_delete', { id })
}

export async function setSecret(
  namespace: string,
  name: string,
  value: string | Uint8Array,
): Promise<void> {
  return invoke('vault_set_secret', {
    namespace,
    name,
    valueB64: encodeSecretValue(value),
  })
}

export async function getSecretBytes(
  namespace: string,
  name: string,
): Promise<Uint8Array | null> {
  const value = await invoke<string | null>('vault_get_secret', { namespace, name })
  return value ? base64ToBytes(value) : null
}

export async function getSecretText(
  namespace: string,
  name: string,
): Promise<string | null> {
  const value = await getSecretBytes(namespace, name)
  return value ? new TextDecoder().decode(value) : null
}

export async function deleteSecret(namespace: string, name: string): Promise<boolean> {
  return invoke<boolean>('vault_delete_secret', { namespace, name })
}

export async function listSecrets(namespace?: string): Promise<SecretDescriptor[]> {
  return invoke<SecretDescriptor[]>('vault_list_secrets', {
    namespace: namespace ?? null,
  })
}

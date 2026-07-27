import { invoke } from '@tauri-apps/api/core';
import { Stronghold, Client, Store } from '@tauri-apps/plugin-stronghold';

const VAULT_FILE = 'app_data.vault';
const CLIENT_NAME = 'bloom_secure_client';

interface StorageInstance {
  stronghold: Stronghold;
  client: Client;
  store: Store;
}

export class SecureStorageError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'SecureStorageError';
    this.cause = cause;
  }
}

let storageInstancePromise: Promise<StorageInstance> | null = null;

async function getStorageInstance(): Promise<StorageInstance> {
  if (storageInstancePromise) {
    return storageInstancePromise;
  }

  const attempt = (async (): Promise<StorageInstance> => {
    const strongholdKey = await invoke<string>('getStrongholdKey');

    const stronghold = await Stronghold.load(VAULT_FILE, strongholdKey);

    let client: Client;
    try {
      client = await stronghold.loadClient(CLIENT_NAME);
    } catch {
      client = await stronghold.createClient(CLIENT_NAME);
    }

    const store = client.getStore();

    return { stronghold, client, store };
  })();

  storageInstancePromise = attempt;

  try {
    return await attempt;
  } catch (error) {
    if (storageInstancePromise === attempt) {
      storageInstancePromise = null;
    }
    throw new SecureStorageError('Failed to initialize secure storage', error);
  }
}

let writeQueue: Promise<void> = Promise.resolve();

function enqueueWrite(task: () => Promise<void>): Promise<void> {
  const result = writeQueue.then(task, task);
  writeQueue = result.catch(() => {});
  return result;
}

export const secureStorage = {
  async setItem(key: string, value: unknown): Promise<void> {
    return enqueueWrite(async () => {
      try {
        const { stronghold, store } = await getStorageInstance();
        const jsonString = JSON.stringify(value);
        const bytes = Array.from(new TextEncoder().encode(jsonString));

        await store.insert(key, bytes);
        await stronghold.save();
      } catch (error) {
        console.error(`[secureStorage] failed to write "${key}":`, error);
        throw new SecureStorageError(`Failed to write key "${key}"`, error);
      }
    });
  },

  async getItem<T = unknown>(key: string): Promise<T | null> {
    let bytes: Uint8Array<ArrayBufferLike> | null | undefined;
    try {
      const { store } = await getStorageInstance();
      bytes = await store.get(key);
    } catch (error) {
      console.error(`[secureStorage] failed to read "${key}":`, error);
      throw new SecureStorageError(`Failed to read key "${key}"`, error);
    }

    if (!bytes || bytes.length === 0) return null;

    try {
      const jsonString = new TextDecoder().decode(new Uint8Array(bytes));
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error(`[secureStorage] corrupted value for "${key}":`, error);
      throw new SecureStorageError(`Corrupted value for key "${key}"`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    return enqueueWrite(async () => {
      try {
        const { stronghold, store } = await getStorageInstance();
        await store.remove(key);
        await stronghold.save();
      } catch (error) {
        console.error(`[secureStorage] failed to delete "${key}":`, error);
        throw new SecureStorageError(`Failed to delete key "${key}"`, error);
      }
    });
  },
};
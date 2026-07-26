import { invoke } from '@tauri-apps/api/core';
import { Stronghold, Client, Store } from '@tauri-apps/plugin-stronghold';

const VAULT_FILE = 'app_data.vault';
const CLIENT_NAME = 'bloom_secure_client';

interface StorageInstance {
  stronghold: Stronghold;
  client: Client;
  store: Store;
}

let storageInstancePromise: Promise<StorageInstance> | null = null;

async function getStorageInstance(): Promise<StorageInstance> {
  if (!storageInstancePromise) {
    storageInstancePromise = (async () => {
      const masterKey = await invoke<string>('get_app_key');

      const stronghold = await Stronghold.load(VAULT_FILE, masterKey);

      let client: Client;
      try {
        client = await stronghold.loadClient(CLIENT_NAME);
      } catch {
        client = await stronghold.createClient(CLIENT_NAME);
      }

      const store = client.getStore();

      return { stronghold, client, store };
    })();
  }
  return storageInstancePromise;
}

export const secureStorage = {
  async setItem(key: string, value: unknown): Promise<void> {
    try {
      const { stronghold, store } = await getStorageInstance();
      const jsonString = JSON.stringify(value);
      const bytes = Array.from(new TextEncoder().encode(jsonString));

      await store.insert(key, bytes);
      await stronghold.save();
    } catch (error) {
      console.error(`[secureStorage] err writing "${key}":`, error);
    }
  },

  async getItem<T = unknown>(key: string): Promise<T | null> {
    try {
      const { store } = await getStorageInstance();
      const bytes = await store.get(key);

      if (!bytes || bytes.length === 0) return null;

      const jsonString = new TextDecoder().decode(new Uint8Array(bytes));
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error(`[secureStorage] err reading "${key}":`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      const { stronghold, store } = await getStorageInstance();
      await store.remove(key);
      await stronghold.save();
    } catch (error) {
      console.error(`[secureStorage] err deleting "${key}":`, error);
    }
  }
};
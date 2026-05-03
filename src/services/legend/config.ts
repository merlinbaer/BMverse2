import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { observablePersistSqlite } from '@legendapp/state/persist-plugins/expo-sqlite'
import { configureSynced } from '@legendapp/state/sync'
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { AsyncStorageStatic } from '@react-native-async-storage/async-storage'
import Storage from 'expo-sqlite/kv-store'
import { del, get, getMany, keys, set, setMany } from 'idb-keyval'
import { Platform } from 'react-native'

import { supabase } from '@/services/supabase'

// JS UUID v4 generator to avoid issues in React Native
export const generateId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

// Simple wrapper to make IndexedDB look like AsyncStorage
const indexedDBStorage: Partial<AsyncStorageStatic> = {
  getItem: async (key: string) => {
    const value = await get<string>(key)
    return value ?? null
  },
  setItem: (key: string, value: string) => set(key, value),
  removeItem: (key: string) => del(key),
  getAllKeys: () => keys() as Promise<string[]>,
  multiGet: async (keys: readonly string[]) => {
    const values = await getMany([...keys])
    return keys.map((key, index) => [key, values[index] ?? null]) as [
      string,
      string | null,
    ][]
  },
  multiSet: (entries: readonly (readonly [string, string])[]) =>
    setMany([...entries] as [IDBValidKey, string][]),
  multiRemove: (keys: readonly string[]) =>
    Promise.all(keys.map(key => del(key))) as unknown as Promise<void>,
}

export const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin:
      Platform.OS === 'web'
        ? observablePersistAsyncStorage({
            AsyncStorage: indexedDBStorage as AsyncStorageStatic,
          })
        : observablePersistSqlite(Storage),
    /* Version with all AsyncStorage
    plugin: observablePersistAsyncStorage({
      AsyncStorage: (Platform.OS === 'web'
        ? indexedDBStorage
        : AsyncStorage) as AsyncStorageStatic,

      }),
    */
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
  onError: error => {
    // Check if it's a network failure (common in local-first apps)
    console.log('LegendState Error:', error?.message)
    if (
      error?.message?.includes('Network request failed') ||
      error?.message?.includes('Fetch')
    ) {
      console.log('LegendState: Sync paused (Offline/Network unavailable)')
    } else {
      // Log other actual logic errors as errors
      console.error('LegendState: Synced Supabase error:', error)
    }
  },
})

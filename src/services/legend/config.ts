import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { observablePersistSqlite } from '@legendapp/state/persist-plugins/expo-sqlite'
import { configureSynced } from '@legendapp/state/sync'
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { AsyncStorageStatic } from '@react-native-async-storage/async-storage'
// import Storage from 'expo-sqlite/kv-store'
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
    if (typeof window === 'undefined') return null
    const value = await get<string>(key)
    return value ?? null
  },
  setItem: async (key: string, value: string) => {
    if (typeof window !== 'undefined') await set(key, value)
  },
  removeItem: async (key: string) => {
    if (typeof window !== 'undefined') await del(key)
  },
  getAllKeys: async () =>
    (typeof window !== 'undefined' ? keys() : []) as Promise<string[]>,
  multiGet: async (keys: readonly string[]) => {
    if (typeof window === 'undefined') return keys.map(k => [k, null])
    const values = await getMany([...keys])
    return keys.map((key, index) => [key, values[index] ?? null]) as [
      string,
      string | null,
    ][]
  },
  multiSet: async (entries: readonly (readonly [string, string])[]) => {
    if (typeof window !== 'undefined')
      await setMany([...entries] as [IDBValidKey, string][])
  },
  multiRemove: async (keys: readonly string[]) => {
    if (typeof window !== 'undefined')
      await Promise.all(keys.map(key => del(key)))
  },
}

export const persistLargeStore =
  Platform.OS === 'web'
    ? observablePersistAsyncStorage({
        AsyncStorage: indexedDBStorage as AsyncStorageStatic,
      })
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      observablePersistSqlite(require('expo-sqlite/kv-store').default)

export const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: persistLargeStore,
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

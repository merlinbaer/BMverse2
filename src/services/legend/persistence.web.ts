import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { AsyncStorageStatic } from '@react-native-async-storage/async-storage'
import { del, get, getMany, keys, set, setMany } from 'idb-keyval'

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

export const persistLargeStore = observablePersistAsyncStorage({
  AsyncStorage: indexedDBStorage as AsyncStorageStatic,
})

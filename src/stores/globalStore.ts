import { computed, observable } from '@legendapp/state'
import { Session } from '@supabase/auth-js'
import { SupabaseClient } from '@supabase/supabase-js'

import { StoreCache, StoreContextType } from '@/contexts/legendstate'
import {
  attachSyncLogger,
  attachUpdateLogger,
  clearCacheStore,
  customSynced,
  syncStore,
} from '@/services/createStore'
import { Database } from '@/types/database.types'

// --- create gl_sync store --------------------------------------
export function createStoreSync(supabase: SupabaseClient<Database>) {
  const tableName = 'gl_sync'
  const sync$ = observable(
    customSynced({
      supabase,
      collection: tableName,
      //  using changesSince:'all' for small tables < 100 rows and more robust sync
      changesSince: 'all', // 'all' | 'last-sync'
      // use syncMode:'manual' when an event (change) should not be synced automatically
      syncMode: 'auto', // 'auto' | 'manual'
      actions: ['read'], // ['create' | 'read' | 'update' | 'delete'];
      persist: { name: tableName },
    }),
  )
  // Computed for the singleton sync row (sync_id: 1)
  const updatedAt$ = computed(() => {
    const data = sync$.get()
    const rows = data ? Object.values(data) : []
    const row = rows.find(r => r?.sync_id === 1) ?? rows[0]
    return row?.updated_at ?? '---'
  })

  attachSyncLogger(sync$, tableName)

  // noinspection JSUnusedGlobalSymbols // clearCacheSync is currently not used
  return {
    data$: sync$,
    updatedAt$: updatedAt$,
    syncSync: () => syncStore(sync$, tableName),
    clearCacheSync: () => clearCacheStore(sync$, tableName),
  }
}

// Define getter for storeSyncInstance
export const getStoreSync = (
  supabase: SupabaseClient<Database>,
): StoreContextType['sync'] => {
  if (!StoreCache.sync) {
    StoreCache.sync = createStoreSync(supabase)
  }
  return StoreCache.sync
}

// --- create gl_versions store --------------------------------------
export function createStoreVersion(supabase: SupabaseClient<Database>) {
  const tableName = 'gl_versions'
  const version$ = observable(
    customSynced({
      supabase,
      collection: tableName,
      // use changesSince:'all' for small tables < 100 rows and more robust sync
      changesSince: 'all', // 'all' | 'last-sync'
      // use syncMode:'manual' when an event (change) should not be synced automatically
      syncMode: 'auto', // 'auto' | 'manual'
      actions: ['read'], // ['create' | 'read' | 'update' | 'delete'];
      persist: { name: tableName },
    }),
  )
  // Computed observable for the latest version string
  const dbVersion$ = computed(() => {
    const versions = version$.get()
    const versionArray = versions ? Object.values(versions) : []
    if (versionArray.length === 0) return '---' // Used for Display in UI
    const latestEntry = versionArray.reduce((prev, current) => {
      return prev.version_id > current.version_id ? prev : current
    })
    return latestEntry.version
  })
  attachSyncLogger(version$, tableName)

  return {
    data$: version$,
    dbVersion$: dbVersion$,
    syncVersion: () => syncStore(version$, tableName),
    clearCacheVersion: () => clearCacheStore(version$, tableName),
  }
}

// Define getter for storeVersionInstance
export const getStoreVersion = (
  supabase: SupabaseClient<Database>,
): StoreContextType['version'] => {
  if (!StoreCache.version) {
    StoreCache.version = createStoreVersion(supabase)
  }
  return StoreCache.version
}

// --- create gl_profiles store --------------------------------------
export function createStoreProfile(
  supabase: SupabaseClient<Database>,
  session: Session,
) {
  const tableName = 'gl_profiles'
  const uid = session?.user?.id ?? '00000000-0000-0000-0000-000000000000'
  const profile$ = observable(
    customSynced({
      supabase,
      collection: tableName,
      filter: select => select.eq('id', uid),
      // use changesSince:'all' for small tables < 100 rows and more robust sync
      changesSince: 'all', // 'all' | 'last-sync'
      // use syncMode:'manual' when an event (change) should not be synced automatically
      syncMode: 'auto', // 'auto' | 'manual'
      actions: ['read', 'update'], // ['create' | 'read' | 'update' | 'delete'];
      persist: { name: tableName },
    }),
  )
  // Computed observable for the latest version string
  const userName$ = computed(() => {
    const profile = profile$.get()
    const profileArray = profile ? Object.values(profile) : []
    return profileArray?.[0]?.user_name ?? '' // Used for TextInput in UI
  })
  // Setting username
  const setUserName = (newName: string) => {
    profile$[uid].user_name.set(newName)
  }
  attachSyncLogger(profile$, tableName)
  attachUpdateLogger(profile$, tableName)

  return {
    data$: profile$,
    userName$: userName$,
    setUserName: setUserName,
    syncProfile: () => syncStore(profile$, tableName),
    clearCacheProfile: () => clearCacheStore(profile$, tableName),
  }
}

// Define singleton for storeProfileInstance
export const getStoreProfile = (
  supabase: SupabaseClient<Database>,
  session: Session,
): StoreContextType['profile'] => {
  if (!StoreCache.profile) {
    StoreCache.profile = createStoreProfile(supabase, session)
  }
  return StoreCache.profile
}

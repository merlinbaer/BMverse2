import { computed, observable, syncState, when } from '@legendapp/state'
import { configureSynced } from '@legendapp/state/sync'
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { Session } from '@supabase/auth-js'
import { SupabaseClient } from '@supabase/supabase-js'
import { v4 as uuid4 } from 'uuid'

import { StoreCache, StoreContextType } from '@/contexts/legendstate'
import { Database } from '@/types/database.types'

const generateId = () => uuid4()

const customSynced = configureSynced(syncedSupabase, {
  fieldId: 'id',
  generateId,
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
  realtime: false,
})

// create gl_sync store
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
  // Attach sync listener on the lastSync state for logging
  const state = syncState(sync$)
  state.lastSync?.onChange?.(({ value }) => {
    if (!value) {
      console.log(`LegendState: No lastSync of ${tableName}`)
    } else {
      const iso = new Date(value).toISOString()
      console.log(`LegendState: LastSync of ${tableName} changed to ${iso}-UTC`)
    }
  })
  // Function to trigger a local first sync
  const syncSync = async () => {
    await when(syncState(sync$).isPersistLoaded)
    try {
      await syncState(sync$).sync()
    } catch (err) {
      console.error(`LegendState: Sync ${tableName} failed:`, err)
    }
  }
  // Function to reset the cache and call a sync
  const clearCacheSync = async () => {
    try {
      // Clear the physical file from AsyncStorage
      await syncState(sync$).clearPersist()
      // Reset metadata (syncCount, error, lastSync) to prevent stale state
      syncState(sync$).reset?.()
      console.log(`LegendState: ${tableName} cache cleared.`)
    } catch (err) {
      console.warn(`LegendState: Failed to clear ${tableName} cache:`, err)
    } finally {
      await syncSync()
    }
  }
  return { sync$: sync$, syncSync: syncSync, clearCacheSync }
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

// create gl_versions store
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
  // Attach sync listener on the lastSync state for logging
  const state = syncState(version$)
  state.lastSync?.onChange?.(({ value }) => {
    if (!value) {
      console.log(`LegendState: No lastSync of ${tableName}`)
    } else {
      const iso = new Date(value).toISOString()
      console.log(`LegendState: LastSync of ${tableName} changed to ${iso}-UTC`)
    }
  })
  // Function to trigger a local first sync
  const syncVersion = async () => {
    await when(syncState(version$).isPersistLoaded)
    try {
      await syncState(version$).sync()
      console.log(`LegendState: Sync for ${tableName} called`)
    } catch (err) {
      console.error(`LegendState: Sync ${tableName} failed:`, err)
    }
  }
  // Function to reset the cache and call a sync
  const clearCacheVersion = async () => {
    try {
      // Clear the physical file from AsyncStorage
      await syncState(version$).clearPersist()
      // Reset metadata (syncCount, error, lastSync) to prevent stale state
      syncState(version$).reset?.()
      console.log(`LegendState: ${tableName} cache cleared.`)
    } catch (err) {
      console.log(`LegendState: Failed to clear ${tableName} cache:`, err)
    } finally {
      // Call sync
      await syncVersion()
    }
  }
  return { version$, dbVersion$, syncVersion, clearCacheVersion }
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

// create gl_profiles store
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
  // Attach sync listener on the lastSync state for logging
  const state = syncState(profile$)
  state.lastSync?.onChange?.(({ value }) => {
    if (!value) {
      console.log(`LegendState: No lastSync of ${tableName}`)
    } else {
      const iso = new Date(value).toISOString()
      console.log(`LegendState: LastSync of ${tableName} changed to ${iso}-UTC`)
    }
  })
  // Attach update listener
  const state$ = syncState(profile$)
  state$.onChange(({ value, getPrevious }) => {
    const prev = getPrevious()
    // 1. We only care about updates happening AFTER an initial load
    if (!value.isLoaded) return
    // 2. Detect the transition from 'Setting' to 'Idle'
    const wasSetting = prev?.isSetting === true
    const isNotSetting = value.isSetting === false
    // 3. Ensure there are no more changes waiting in the queue
    const nothingPending = value.numPendingSets === 0

    if (wasSetting && isNotSetting && nothingPending) {
      console.log(
        `LegendState: ${tableName} update successfully and confirmed by Supabase!`,
      )
    }
  })
  // Function to trigger a local first sync
  const syncProfile = async () => {
    await when(syncState(profile$).isPersistLoaded)
    try {
      await syncState(profile$).sync()
      console.log(`LegendState: Sync for ${tableName} called`)
    } catch (err) {
      console.error(`LegendState: Sync ${tableName} failed:`, err)
    }
  }
  // Function to reset the cache and call a sync
  const clearCacheProfile = async () => {
    try {
      // Clear the physical file from AsyncStorage
      await syncState(profile$).clearPersist()
      // Reset metadata (syncCount, error, lastSync) to prevent stale state
      syncState(profile$).reset?.()
      console.log(`LegendState: ${tableName} cache cleared.`)
    } catch (err) {
      console.warn(`LegendState: Failed to clear ${tableName} cache:`, err)
    } finally {
      await syncProfile()
    }
  }

  return { profile$, userName$, syncProfile, clearCacheProfile }
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

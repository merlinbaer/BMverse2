import { computed, observable, syncState, when } from '@legendapp/state'
import { configureSynced } from '@legendapp/state/sync'
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { SupabaseClient } from '@supabase/supabase-js'
import { v4 as uuid4 } from 'uuid'

import { localStore$ } from '@/stores/localStore'
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
let storeSyncInstance: ReturnType<typeof createStoreSync> | null = null

function createStoreSync(supabase: SupabaseClient<Database>) {
  const tableName = 'gl_sync'
  const sync$ = observable(
    customSynced({
      supabase,
      collection: tableName,
      as: 'value', // table is a singleton with one row. Values can be fetched directly
      //  using changesSince:'all' for small tables < 100 rows and more robust sync
      changesSince: 'all', // 'all' | 'last-sync'
      // use syncMode:'manual' when an event (change) should not be synced automatically
      syncMode: 'auto', // 'auto' | 'manual'
      actions: ['read'], // ['create' | 'read' | 'update' | 'delete'];
      persist: { name: tableName },
    }),
  )

  // Attach sync listener to handle cascading App Sync
  sync$.onChange(async ({ value }) => {
    if (!value || !value.updated_at) {
      console.log(
        `LegendState: ${tableName} changed to null value or updated_at is null`,
      )
      return
    } else {
      const serverUpdatedAt = value.updated_at
      const lastLocalSync = localStore$.lastSync.get()
      // If the server date is newer than our stored localLastSync
      if (
        !lastLocalSync ||
        new Date(serverUpdatedAt) > new Date(lastLocalSync)
      ) {
        console.log(
          `LegendState: New global update detected (${serverUpdatedAt}). Syncing version...`,
        )
        const { version$, syncVersion } = getStoreVersion(supabase)
        try {
          // Wait for persistence to load before triggering sync to avoid race conditions
          await when(syncState(version$).isPersistLoaded)
          // Trigger the cascade
          await syncVersion()
          // Update the local persistent record only after successful sync
          localStore$.lastSync.set(serverUpdatedAt)
        } catch (err) {
          console.error('LegendState: Cascade sync failed:', err)
        }
      }
    }
  })

  // Attach sync listener
  const state = syncState(sync$)
  state.lastSync?.onChange?.(({ value }) => {
    if (value == null) {
      console.log(`LegendState: LastSync of ${tableName} changed to null`)
      return // handles undefined (and null just in case)
    } else {
      const iso = new Date(value).toISOString()
      console.log(
        `LegendState: LastSync of ${tableName} changed to (lastSync)=${iso}-UTC)`,
      )
    }
  })

  // Function to trigger a local first gl_versions sync
  const syncSync = async () => {
    await when(syncState(sync$).isPersistLoaded)
    try {
      await syncState(sync$).sync()
      console.log('LegendState: Sync for ' + tableName + ' called')
    } catch (err) {
      console.error('LegendState: Manual sync ' + tableName + ' failed:', err)
    }
  }

  const clearSyncCache = async () => {
    await syncState(sync$).clearPersist()
    syncState(sync$).reset?.()
  }

  return { sync$: sync$, syncSync: syncSync, clearSyncCache: clearSyncCache }
}

export const getStoreSync = (supabase: SupabaseClient<Database>) => {
  if (!storeSyncInstance) {
    storeSyncInstance = createStoreSync(supabase)
  }
  return storeSyncInstance
}

// create gl_version store
let storeVersionInstance: ReturnType<typeof createStoreVersion> | null = null

function createStoreVersion(supabase: SupabaseClient<Database>) {
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

  // Attach sync listener
  const state = syncState(version$)
  state.lastSync?.onChange?.(({ value }) => {
    if (value == null) {
      console.log(`LegendState: LastSync of ${tableName} changed to null`)
      return // handles undefined (and null just in case)
    } else {
      const iso = new Date(value).toISOString()
      console.log(
        `LegendState: LastSync of ${tableName} changed to (lastSync)=${iso}-UTC)`,
      )
    }
  })

  // Computed observable for the latest version string
  const dbVersion$ = computed(() => {
    const versions = version$.get()
    const versionArray = versions ? Object.values(versions) : []
    if (versionArray.length === 0) return '---'
    const latestEntry = versionArray.reduce((prev, current) => {
      return prev.version_id > current.version_id ? prev : current
    })
    return latestEntry.version
  })

  // Function to trigger a local first gl_versions sync
  const syncVersion = async () => {
    await when(syncState(version$).isPersistLoaded)
    try {
      await syncState(version$).sync()
      console.log('LegendState: Sync for ' + tableName + ' called')
    } catch (err) {
      console.error('LegendState: Manual sync  ' + tableName + ' failed:', err)
    }
  }

  const clearVersionCache = async () => {
    await syncState(version$).clearPersist()
    syncState(version$).reset?.()
  }

  return { version$, dbVersion$, syncVersion, clearVersionCache }
}

export const getStoreVersion = (supabase: SupabaseClient<Database>) => {
  if (!storeVersionInstance) {
    storeVersionInstance = createStoreVersion(supabase)
  }
  return storeVersionInstance
}

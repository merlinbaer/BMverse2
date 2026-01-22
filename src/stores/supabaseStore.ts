import { computed, observable, syncState, when } from '@legendapp/state'
import { configureSynced } from '@legendapp/state/sync'
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { v4 as uuid4 } from 'uuid'
import { SupabaseClient } from '@supabase/supabase-js'
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

// Singleton instance (per JS runtime/app session)
let storeVersionInstance: ReturnType<typeof createStoreVersion> | null = null

function createStoreVersion(supabase: SupabaseClient<Database>) {
  const tableName = 'gl_versions'
  const version$ = observable(
    customSynced({
      supabase,
      collection: tableName,
      // use changesSince:'all' for small tables < 100 rows. 'all' can recover soft deletes
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
      console.log('LegendState: Sync ' + tableName + ' complete')
    } catch (err) {
      console.error('LegendState: Sync  ' + tableName + ' failed:', err)
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

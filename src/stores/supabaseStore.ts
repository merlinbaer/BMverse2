import { observable, syncState, when } from '@legendapp/state'
import { configureSynced } from '@legendapp/state/sync'
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { v4 as uuid4 } from 'uuid'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import AsyncStorage from '@react-native-async-storage/async-storage'

const generateId = () => uuid4()

let storesInstance: ReturnType<typeof createStoresInternal> | null = null

export const createStoresInternal = (supabase: SupabaseClient<Database>) => {
  const customSynced = configureSynced(syncedSupabase, {
    generateId,
    supabase,
    changesSince: 'last-sync',
    fieldCreatedAt: 'created_at',
    fieldUpdatedAt: 'updated_at',
    fieldDeleted: 'deleted',
  })

  const version$ = observable(
    customSynced({
      collection: 'gl_version_view',
      syncMode: 'manual',
      actions: ['read'],
      realtime: false,
      persist: { name: 'gl_version_view' },
    }),
  )
  // Function to trigger the sync
  const syncAllData = async () => {
    const SYNC_KEY = 'last_sync_gl_version'
    const ONE_HOUR = 3600000
    await when(syncState(version$).isPersistLoaded)
    try {
      // Check if we actually need to sync
      const lastSync = await AsyncStorage.getItem(SYNC_KEY)
      const now = Date.now()

      // Check if the observable is currently empty
      const currentData = version$.get()
      const hasNoData = !currentData || Object.keys(currentData).length === 0

      // Condition: Sync if 1 hour passed OR we have absolutely nothing locally
      if (!hasNoData && lastSync && now - parseInt(lastSync) < ONE_HOUR) {
        console.log('LegendState: Skipping Sync, using existing local data.')
        return
      }

      console.log('LegendState: Syncing version data...')
      await syncState(version$).sync()

      // Save the timestamp ONLY after a successful sync
      await AsyncStorage.setItem(SYNC_KEY, now.toString())
      console.log('LegendState: Sync complete')
    } catch (err) {
      console.error('LegendState: Sync failed:', err)
    }
  }

  return { version$, syncAllData }
}

export const getStores = (supabase: SupabaseClient<Database>) => {
  if (!storesInstance) {
    console.log('LegendState: Initializing Database Store ...')
    storesInstance = createStoresInternal(supabase)
    storesInstance.version$.peek()
    storesInstance.syncAllData().catch(err => {
      console.error('LegendState: Initial sync failed', err)
    })
  }
  return storesInstance
}

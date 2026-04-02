import { syncState, when } from '@legendapp/state'
import * as SplashScreen from 'expo-splash-screen'

import { SYNC } from '@/constants/constants'
import { news$, sync$, syncNews, syncSync } from '@/services/legend'
import { localStore$ } from '@/services/legend/local/primitives'
import { syncVersion, version$ } from '@/services/legend/tables/versions'
import { Database } from '@/types/database.types'

// Used in root _layout
export function initializeSplashScreen(duration = 500) {
  SplashScreen.setOptions({
    duration: duration,
    fade: true,
  })
  SplashScreen.preventAutoHideAsync().catch(() => {})
}

// Used in root _layout
export const initializeLocalStates = () => {
  // Wake up local-only persisted stores
  try {
    localStore$.peek()
    console.log('LegendState: Local states initialized.')
  } catch (error) {
    console.log('LegendState: Failed to initialize local states:', error)
  }
}

// Used in StoreProvider
export const startSyncCoordinator = () => {
  const news = news$
  const sync = sync$
  const version = version$

  type SyncRow = Database['public']['Tables']['gl_sync']['Row']
  type SyncCollection = Record<string, SyncRow>

  const getSyncRow = (value?: SyncCollection) => {
    const rows = Object.values(value ?? {})
    return rows.find(row => row?.sync_id === 1) ?? rows[0]
  }

  // Cascade on sync marker change
  const unsubscribeSync = sync.onChange(async ({ value }) => {
    const row = getSyncRow(value as SyncCollection | undefined)
    if (!row?.updated_at) return

    const serverUpdatedAt = row.updated_at
    const lastLocalSync = localStore$.lastSync.get()

    if (!lastLocalSync || new Date(serverUpdatedAt) > new Date(lastLocalSync)) {
      console.log(
        `LegendState: Last server update at ${serverUpdatedAt}. Start syncing tables...`,
      )

      try {
        await when(syncState(version.data$).isPersistLoaded)
        await syncVersion()

        await when(syncState(news.data$).isPersistLoaded)
        await syncNews()

        localStore$.lastSync.set(serverUpdatedAt)
        console.log('LegendState: Cascade sync successful.')
      } catch (err) {
        console.error('LegendState: Cascade sync failed:', err)
      }
    }
  })
  // Automated "Heartbeat" Sync
  const intervalId = setInterval(async () => {
    const state$ = syncState(sync.data$)
    const isReady = state$.isLoaded.get() && !state$.error.get()

    if (isReady) {
      // console.log('LegendState: Heartbeat trigger - checking for updates...')
      // Above log is not needed "Sync for gl_sync called" is shown in syncSync
      try {
        await syncSync()
      } catch {
        // Already? handled by global onError and internal syncSync catch
      }
    }
  }, SYNC.REFRESH_INTERVAL)

  return () => {
    unsubscribeSync?.()
    clearInterval(intervalId)
  }
}

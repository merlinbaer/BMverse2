import { syncState, when } from '@legendapp/state'
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { configureObservableSync } from '@legendapp/state/sync'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'

import { SYNC } from '@/constants/constants'
import { StoreContextType } from '@/contexts/legendstate'
import { localStore$ } from '@/stores/localStore'
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
export function initializeStateCacheConfig() {
  configureObservableSync({
    persist: {
      plugin: new ObservablePersistAsyncStorage({
        AsyncStorage,
      }),
      retrySync: true,
    },
    retry: {
      infinite: true,
      backoff: 'exponential', //  "constant" | "exponential"
      delay: SYNC.DELAY, // hopefully ms?
      maxDelay: SYNC.MAX_DELAY, // approx. 1 hour 14 min
    },
    onError: error => {
      // Check if it's a network failure (common in local-first apps)
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
}

// Used in root _layout
export const initializeLocalStates = () => {
  // Wake up local-only persisted stores
  try {
    localStore$.peek()
  } catch (error) {
    console.log('LegendState: Failed to initialize local states:', error)
  }
}

// Used in StoreProvider
export const startSyncCoordinator = (stores: StoreContextType) => {
  const { sync, version, profile } = stores

  type SyncRow = Database['public']['Tables']['gl_sync']['Row']
  type SyncCollection = Record<string, SyncRow>

  const getSyncRow = (value?: SyncCollection) => {
    const rows = Object.values(value ?? {})
    return rows.find(row => row?.sync_id === 1) ?? rows[0]
  }

  // Cascade on sync marker change
  const unsubscribeSync = sync.sync$.onChange(async ({ value }) => {
    const row = getSyncRow(value as SyncCollection | undefined)
    if (!row?.updated_at) return

    const serverUpdatedAt = row.updated_at
    const lastLocalSync = localStore$.lastSync.get()

    if (!lastLocalSync || new Date(serverUpdatedAt) > new Date(lastLocalSync)) {
      console.log(
        `LegendState: Last server update at ${serverUpdatedAt}. Start syncing tables...`,
      )

      try {
        await when(syncState(version.version$).isPersistLoaded)
        await version.syncVersion()

        await when(syncState(profile.profile$).isPersistLoaded)
        await profile.syncProfile()

        localStore$.lastSync.set(serverUpdatedAt)
        console.log('LegendState: Cascade sync successful.')
      } catch (err) {
        console.error('LegendState: Cascade sync failed:', err)
      }
    }
  })
  // Automated "Heartbeat" Sync
  const intervalId = setInterval(async () => {
    const state$ = syncState(sync.sync$)
    const isReady = state$.isLoaded.get() && !state$.error.get()

    if (isReady) {
      console.log('LegendState: Heartbeat trigger - checking for updates...')
      try {
        await sync.syncSync()
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

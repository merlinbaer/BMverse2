import { syncState } from '@legendapp/state'
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { configureObservableSync } from '@legendapp/state/sync'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'

import { SYNC } from '@/constants/constants'
import { GlobalStoreContextType } from '@/stores/globalStore'
import { localStore$ } from '@/stores/localStore'

export function initializeSplashScreen(duration = 500) {
  SplashScreen.setOptions({
    duration: duration,
    fade: true,
  })
  SplashScreen.preventAutoHideAsync().catch(() => {})
}

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

export const initializeLocalStates = () => {
  // Wake up local-only persisted stores
  localStore$.peek()
}

export const initializeDatabaseStates = (stores: GlobalStoreContextType) => {
  const { sync, version, profile } = stores

  sync.sync$.peek()
  version.version$.peek()
  profile.profile$.peek()

  // Automated "Heartbeat" Sync
  setInterval(async () => {
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
}

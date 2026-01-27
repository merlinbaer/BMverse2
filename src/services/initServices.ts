import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { configureObservableSync } from '@legendapp/state/sync'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SupabaseClient } from '@supabase/supabase-js'
import * as SplashScreen from 'expo-splash-screen'

import { getStoreSync, getStoreVersion } from '@/stores/globalStore'
import { localStore$ } from '@/stores/localStore'
import { Database } from '@/types/database.types'

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
      delay: 1000, // hopefully ms?
      maxDelay: 4096000, // approx. 1 hour 14 min
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

export const initializeDatabaseStates = (
  supabase: SupabaseClient<Database>,
) => {
  const { sync$ } = getStoreSync(supabase)
  sync$.peek()
  const { version$ } = getStoreVersion(supabase)
  version$.peek()
}

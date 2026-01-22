import { configureObservableSync } from '@legendapp/state/sync'
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'

export function initializeSplashScreen(duration = 500) {
  SplashScreen.setOptions({
    duration: duration,
    fade: true,
  })
  SplashScreen.preventAutoHideAsync().catch(() => {})
}

export function initializeState() {
  configureObservableSync({
    persist: {
      plugin: new ObservablePersistAsyncStorage({
        AsyncStorage,
      }),
      retrySync: true,
    },
    retry: {
      infinite: true,
      backoff: 'exponential', //  "constant" | "exponential" | undefined
      delay: 1000, // ms?
      maxDelay: 3600000, // 1 hour
    },
    onError: error =>
      console.error('LegendState: Synced Supabase error:', error),
  })
}

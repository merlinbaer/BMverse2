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
    // global retry logic or error handling here later
    retry: {
      infinite: true,
    },
    onError: error => console.error('Synced Supabase error:', error),
  })
}

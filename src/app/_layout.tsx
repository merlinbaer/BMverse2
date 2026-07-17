import { syncState } from '@legendapp/state'
import { useValue } from '@legendapp/state/react'
import { useFonts } from 'expo-font'
import { Stack, useRouter, useSegments } from 'expo-router'
import Head from 'expo-router/head'
import { ThemeProvider } from 'expo-router/react-navigation'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { AppTheme } from '@/constants/constants'
import { bmFonts } from '@/layout/fonts'
import { initAssets } from '@/services/assets'
import { initAudioMode } from '@/services/audio'
import { initAuth } from '@/services/auth'
import { initPlayerStats } from '@/services/games'
import {
  isAuthLoaded$,
  isInstallDismissed$,
  localStore$,
} from '@/services/legend'
import { initializeStores, startSyncCoordinator } from '@/services/legend/lib'
import {
  refreshLocalCoverList,
  refreshLocalMusicList,
} from '@/services/player/files'
import { isPWA, registerServiceWorker } from '@/services/pwa'

SplashScreen.setOptions({
  duration: 500,
  fade: true,
})
void SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()
  const segments = useSegments() as string[]
  const isDismissed = useValue(isInstallDismissed$)

  // 1. Monitor hydration status for the local store
  const localSyncStatus = useValue(syncState(localStore$))
  const isHydrated = localSyncStatus.isPersistLoaded

  // 2. Startup authentication is done (check due to async operation)
  const isAuthLoaded = useValue(isAuthLoaded$)

  // 3. Once hydrated, get the actual value from the disk
  const isOnboarding = useValue(localStore$.isOnboarding)
  const [loaded, error] = useFonts(bmFonts)

  // 4. Show Install Screen when Web and no PWA
  useEffect(() => {
    if (Platform.OS !== 'web') return
    if (!isHydrated || !isAuthLoaded) return
    const inInstallScreen = segments.includes('install')
    // Redirect IF on web AND not PWA AND not already on the installation screen AND not dismissed
    if (!isPWA() && !inInstallScreen && !isDismissed) {
      router.replace('/(onboarding)/install')
    }
  }, [segments, isHydrated, isAuthLoaded, router, isDismissed])

  // 5. One time tasks, this runs once
  useEffect(() => {
    initAuth()
    initializeStores() // Starting warming up table stores
    void initAssets()
    void refreshLocalMusicList()
    void refreshLocalCoverList()
    startSyncCoordinator()
    initAudioMode()
    initPlayerStats()
    void registerServiceWorker()
  }, [])

  // 6. Can run several times
  useEffect(() => {
    // Hide the splash screen ONLY when fonts AND local data are ready
    if ((loaded || error) && isHydrated && isAuthLoaded) {
      void SplashScreen.hideAsync()
      if (typeof document !== 'undefined') {
        document.body.classList.add('app-loaded')
      }
    }
  }, [loaded, error, isHydrated, isAuthLoaded])

  if ((!loaded && !error) || !isHydrated || !isAuthLoaded) {
    return null
  }
  const showInstallGate = Platform.OS === 'web' && !isPWA() && !isDismissed

  return (
    <ThemeProvider value={AppTheme}>
      <Head>
        {/* eslint-disable-next-line react-native/no-raw-text */}
        <title>BMverse2</title>
        <meta
          name="description"
          content="Welcome to BMVerse a fanmade BABYMETAL App"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {/* First called Screens: only show if is called first */}
        <Stack.Protected guard={showInstallGate || isOnboarding}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        {/* Main Screens: show after App is initialized */}
        <Stack.Protected guard={!showInstallGate && !isOnboarding}>
          <Stack.Screen name="(main)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  )
}

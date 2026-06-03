import { syncState } from '@legendapp/state'
import { useValue } from '@legendapp/state/react'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { ThemeProvider } from 'expo-router/react-navigation'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { AppTheme } from '@/constants/constants'
import { bmFonts } from '@/layout/fonts'
import { initAudioMode } from '@/services/audio'
import { initAuth } from '@/services/auth'
import { isAuthLoaded$, localStore$ } from '@/services/legend'
import { initializeStores, startSyncCoordinator } from '@/services/legend/lib'

SplashScreen.setOptions({
  duration: 500,
  fade: true,
})
void SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  // 1. Monitor hydration status for the local store
  const localSyncStatus = useValue(syncState(localStore$))
  const isHydrated = localSyncStatus.isPersistLoaded

  // 2. Startup authentication is done (check due to async operation)
  const isAuthLoaded = useValue(isAuthLoaded$)

  // 3. Once hydrated, get the actual value from the disk
  const isOnboarding = useValue(localStore$.isOnboarding)
  const [loaded, error] = useFonts(bmFonts)

  // 4. One time tasks, this runs once
  useEffect(() => {
    initAuth()
    initializeStores() // Starting warming up table stores
    startSyncCoordinator()
    initAudioMode()
  }, [])

  // 5. Can run several times
  useEffect(() => {
    // Hide the splash screen ONLY when fonts AND local data are ready
    if ((loaded || error) && isHydrated && isAuthLoaded) {
      void SplashScreen.hideAsync()
    }
  }, [loaded, error, isHydrated, isAuthLoaded])

  if ((!loaded && !error) || !isHydrated || !isAuthLoaded) {
    return null
  }

  return (
    <ThemeProvider value={AppTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {/* First called Screens: only show if is called first */}
        <Stack.Protected guard={isOnboarding}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        {/* Main Screens: show after App is initialized */}
        <Stack.Protected guard={!isOnboarding}>
          <Stack.Screen name="(main)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  )
}

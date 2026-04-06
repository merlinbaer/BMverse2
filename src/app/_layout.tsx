import { useValue } from '@legendapp/state/react'
import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { AppTheme } from '@/constants/constants'
import { initAuth } from '@/services/auth'
import { localStore$ } from '@/services/legend'
import { initializeStores, startSyncCoordinator } from '@/services/legend/lib'

SplashScreen.setOptions({
  duration: 500,
  fade: true,
})

export default function RootLayout() {
  const isOnboarding = useValue(localStore$.isOnboarding)
  useEffect(() => {
    initAuth()
    initializeStores()
    startSyncCoordinator()
    SplashScreen.hideAsync().catch(() => {})
  }, [])

  return (
    <ThemeProvider value={AppTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {/* First called Screens: only show if is first called */}
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

import { useValue } from '@legendapp/state/react'
import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { AppTheme } from '@/constants/constants'
import { initAuth } from '@/services/auth'
import {
  initializeLocalStates,
  initializeSplashScreen,
} from '@/services/initServices'
import { localStore$ } from '@/services/legend/local/primitives'

initializeSplashScreen()
initializeLocalStates()

export default function RootLayout() {
  const isFirstCall = useValue(localStore$.isFirstCall)
  useEffect(() => {
    initAuth()
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
        <Stack.Protected guard={isFirstCall}>
          <Stack.Screen name="(firstCall)" />
        </Stack.Protected>

        {/* Main Screens: show after App is initialized */}
        <Stack.Protected guard={!isFirstCall}>
          <Stack.Screen name="(main)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  )
}

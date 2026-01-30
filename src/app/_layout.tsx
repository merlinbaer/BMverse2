import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import LoadScreen from '@/components/LoadScreen'
import { AppTheme } from '@/constants/constants'
import { useSupabase } from '@/hooks/useSupabase'
import { AuthProvider } from '@/providers/AuthProvider'
import {
  initializeLocalStates,
  initializeSplashScreen,
  initializeStateCacheConfig,
} from '@/services/initServices'

initializeSplashScreen()
initializeStateCacheConfig()
initializeLocalStates()

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}

function RootNavigator() {
  const { session, restoring } = useSupabase()

  // Only hide SplashScreen when the session has been loaded
  useEffect(() => {
    let mounted = true
    if (!restoring && mounted) {
      SplashScreen.hideAsync().catch(() => {})
    }
    return () => {
      mounted = false
    }
  }, [restoring])

  // Just in case. Usually the splash screen should be hidden by now
  if (restoring) {
    return <LoadScreen />
  }

  // Guard logic for screens
  const isProtected = !!session
  const isPublic = !session

  return (
    <ThemeProvider value={AppTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {/* Protected Screens: only show if user is logged in  */}
        <Stack.Protected guard={isProtected}>
          <Stack.Screen name="(protected)" />
        </Stack.Protected>

        {/* Public Screens: only show if no user */}
        <Stack.Protected guard={isPublic}>
          <Stack.Screen name="(public)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  )
}

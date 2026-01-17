// noinspection JSUnusedGlobalSymbols

import { AuthProvider } from '@/components/AuthProvider'
import { useSupabase } from '@/hooks/useSupabase'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { COLORS } from '@/constants/constants'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.BACKGROUND,
    card: COLORS.BACKGROUND,
  },
}

SplashScreen.setOptions({
  duration: 500,
  fade: true,
})

// SplashScreen remains visible until we explicitly hide it
SplashScreen.preventAutoHideAsync().catch(() => {})

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

  if (restoring) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    )
  }

  // 🔹 Guard logic for screens
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
        {/* Protected Screens: only show if user is logged in */}
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
})

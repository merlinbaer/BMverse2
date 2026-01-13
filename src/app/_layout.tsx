import { AuthProvider } from '@/components/AuthProvider'
import { useSupabase } from '@/hooks/useSupabase'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { COLORS } from '@/constants/constants'

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

// SplashScreen bleibt sichtbar, bis wir es explizit ausblenden
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}

function RootNavigator() {
  const { session, restoring } = useSupabase()

  // SplashScreen nur ausblenden, wenn Session geladen wurde
  useEffect(() => {
    let mounted = true
    if (!restoring && mounted) {
      SplashScreen.hideAsync()
    }
    return () => {
      mounted = false
    }
  }, [restoring])

  // 🔹 Guard-Logik für Screens
  const isProtected = !restoring && !!session
  const isPublic = !restoring && !session

  return (
    <ThemeProvider value={AppTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {/* Protected Screens: nur zeigen, wenn User eingeloggt */}
        <Stack.Protected guard={isProtected}>
          <Stack.Screen name="(protected)" />
        </Stack.Protected>

        {/* Public Screens: nur zeigen, wenn kein User */}
        <Stack.Protected guard={isPublic}>
          <Stack.Screen name="(public)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  )
}

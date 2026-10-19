import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}

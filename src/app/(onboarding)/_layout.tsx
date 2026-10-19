import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function PublicLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ ...LayoutScreenHeader, headerTitle: 'Welcome' }}
      />
      <Stack.Screen
        name="terms"
        options={{ ...LayoutScreenHeader, headerTitle: 'Terms' }}
      />
      <Stack.Screen
        name="privacy"
        options={{ ...LayoutScreenHeader, headerTitle: 'Privacy' }}
      />
      <Stack.Screen name="install" options={{ headerShown: false }} />
    </Stack>
  )
}

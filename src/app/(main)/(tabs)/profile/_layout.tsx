import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack initialRouteName="Settings">
      <Stack.Screen name="Settings" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}

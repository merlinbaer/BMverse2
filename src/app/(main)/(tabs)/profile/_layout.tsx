import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack initialRouteName="Profile">
      <Stack.Screen name="Profile" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}

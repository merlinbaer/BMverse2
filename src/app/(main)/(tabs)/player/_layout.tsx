import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack initialRouteName="playerScreen">
      <Stack.Screen name="playerScreen" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}

import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack initialRouteName="Player">
      <Stack.Screen name="Player" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}

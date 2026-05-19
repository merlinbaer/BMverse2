import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack initialRouteName="gamesScreen">
      <Stack.Screen name="gamesScreen" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}

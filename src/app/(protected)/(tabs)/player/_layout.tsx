import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/constants/constants'

export default function Layout() {
  return (
    <Stack initialRouteName="playerScreen">
      <Stack.Screen
        name="playerScreen"
        options={{ ...LayoutScreenHeader, headerTitle: 'Music Player' }}
      />
    </Stack>
  )
}

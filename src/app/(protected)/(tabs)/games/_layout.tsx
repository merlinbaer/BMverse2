import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/constants/constants'

export default function Layout() {
  return (
    <Stack initialRouteName="gamesScreen">
      <Stack.Screen
        name="gamesScreen"
        options={{ ...LayoutScreenHeader, headerTitle: 'Games' }}
      />
    </Stack>
  )
}

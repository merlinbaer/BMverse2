import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/constants/constants'

export default function Layout() {
  return (
    <Stack initialRouteName="mainScreen">
      <Stack.Screen
        name="mainScreen"
        options={{ ...LayoutScreenHeader, headerTitle: 'Main' }}
      />
    </Stack>
  )
}

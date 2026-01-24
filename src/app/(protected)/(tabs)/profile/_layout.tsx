import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/constants/constants'

export default function Layout() {
  return (
    <Stack initialRouteName="profileScreen">
      <Stack.Screen
        name="profileScreen"
        options={{ ...LayoutScreenHeader, headerTitle: 'Profile' }}
      />
    </Stack>
  )
}

import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack initialRouteName="profileScreen">
      <Stack.Screen name="profileScreen" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}

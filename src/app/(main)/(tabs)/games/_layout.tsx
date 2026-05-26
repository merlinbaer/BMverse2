import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack initialRouteName="Games">
      <Stack.Screen name="Games" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}

import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack
      initialRouteName="Fox"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Fox" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}

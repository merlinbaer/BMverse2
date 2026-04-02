import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/constants/constants'

export default function Layout() {
  return (
    <Stack
      initialRouteName="foxScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="foxScreen"
        options={{ ...LayoutScreenHeader, headerTitle: '' }}
      />
    </Stack>
  )
}

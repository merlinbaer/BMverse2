import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/constants/constants'

export default function PublicLayout() {
  return (
    <Stack initialRouteName="welcome">
      <Stack.Screen
        name="welcome"
        options={{ ...LayoutScreenHeader, headerTitle: 'Welcome' }}
      />
      <Stack.Screen
        name="login"
        options={{ ...LayoutScreenHeader, headerTitle: 'Login' }}
      />
      <Stack.Screen
        name="verify"
        options={{ ...LayoutScreenHeader, headerTitle: 'Verify' }}
      />
    </Stack>
  )
}

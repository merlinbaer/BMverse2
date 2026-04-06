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
        name="terms"
        options={{ ...LayoutScreenHeader, headerTitle: 'Terms' }}
      />
      <Stack.Screen
        name="privacy"
        options={{ ...LayoutScreenHeader, headerTitle: 'Privacy' }}
      />
    </Stack>
  )
}

import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack initialRouteName="Settings">
      <Stack.Screen name="Settings" />
    </Stack>
  )
}

/*
import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack initialRouteName="profileScreen">
      <Stack.Screen name="profileScreen" options={{ ...LayoutScreenHeader }} />
    </Stack>
  )
}
*/

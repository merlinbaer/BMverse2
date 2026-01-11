import { LayoutScreenHeader } from '@/constants/constants'
import { Stack } from 'expo-router'

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

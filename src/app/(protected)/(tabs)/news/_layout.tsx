import { LayoutScreenHeader } from '@/constants/constants'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack initialRouteName="newsScreen">
      <Stack.Screen
        name="newsScreen"
        options={{ ...LayoutScreenHeader, headerTitle: 'News' }}
      />
    </Stack>
  )
}

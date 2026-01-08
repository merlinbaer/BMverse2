import { LayoutScreenHeader } from '@/constants/constants'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ ...LayoutScreenHeader, headerTitle: 'News' }}
      />
    </Stack>
  )
}

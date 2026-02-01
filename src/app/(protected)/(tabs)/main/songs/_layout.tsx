import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/constants/constants'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...LayoutScreenHeader,
      }}
    ></Stack>
  )
}

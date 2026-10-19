import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...LayoutScreenHeader,
        headerShown: false,
      }}
    ></Stack>
  )
}

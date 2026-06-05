import { Stack } from 'expo-router'

import { LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack
      initialRouteName="Games"
      screenOptions={{
        ...LayoutScreenHeader,
        headerShown: false,
      }}
    ></Stack>
  )
}

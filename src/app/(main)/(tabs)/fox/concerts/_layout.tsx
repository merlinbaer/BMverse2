import { Stack } from 'expo-router'

import { BackButton, LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...LayoutScreenHeader,
        headerLeft: () => <BackButton />,
      }}
    ></Stack>
  )
}

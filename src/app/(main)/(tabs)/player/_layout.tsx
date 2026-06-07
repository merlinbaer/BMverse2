import { Stack } from 'expo-router'
import React from 'react'

import { BackButton, LayoutScreenHeader } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...LayoutScreenHeader,
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="Player"
        options={{
          ...LayoutScreenHeader,
          headerLeft: undefined,
        }}
      />
    </Stack>
  )
}

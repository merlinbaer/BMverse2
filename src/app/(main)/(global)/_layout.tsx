import { Stack } from 'expo-router'
import React from 'react'

import { COLORS } from '@/constants/constants'

// Modal screens that cover the entire screen, including tab bar
export default function GlobalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="SongSort"
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: COLORS.TRANSPARENT,
          },
        }}
      />
      <Stack.Screen
        name="VideoSort"
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: COLORS.TRANSPARENT,
          },
        }}
      />
      <Stack.Screen
        name="Player"
        options={{
          headerShown: false,
          title: 'Player',
          headerBackButtonDisplayMode: 'minimal',
          headerTransparent: true,
        }}
      />
    </Stack>
  )
}

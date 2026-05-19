import { Stack } from 'expo-router'

import { COLORS } from '@/constants/constants'
import {
  BackButton,
  LayoutScreenHeader,
  SortButton,
} from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...LayoutScreenHeader,
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="Songs"
        options={{
          title: 'Songs',
          headerRight: () => <SortButton targetRoute="/fox/songs/SongSort" />,
        }}
      />
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
    </Stack>
  )
}

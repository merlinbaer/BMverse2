import { Stack } from 'expo-router'

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
          headerRight: () => (
            <SortButton targetRoute="/(main)/(global)/SongSort" />
          ),
        }}
      />
    </Stack>
  )
}

/*
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
 */

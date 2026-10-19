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
        name="index"
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

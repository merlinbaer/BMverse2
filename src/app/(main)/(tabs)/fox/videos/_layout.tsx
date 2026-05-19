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
        name="Videos"
        options={{
          title: 'Videos',
          headerRight: () => (
            <SortButton targetRoute="/(main)/(global)/VideoSort" />
          ),
        }}
      />
    </Stack>
  )
}

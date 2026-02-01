import { Stack } from 'expo-router'

import { StoreProvider } from '@/providers/StoreProvider'

export default function ProtectedLayout() {
  return (
    <StoreProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="(global)/player"
          options={{
            title: 'Player',
            headerBackButtonDisplayMode: 'minimal',
            headerTransparent: true,
          }}
        />
      </Stack>
    </StoreProvider>
  )
}

import { Stack } from 'expo-router'

import { StoreProvider } from '@/providers/StoreProvider'

export default function ProtectedLayout() {
  return (
    <StoreProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
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

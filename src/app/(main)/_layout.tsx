import { useObserve } from '@legendapp/state/react'
import { Stack } from 'expo-router'

import { authUser$, profileUserStoreLoad } from '@/services/legend'

export default function MainLayout() {
  useObserve(authUser$, e => {
    const user = e.value
    if (user?.id) {
      profileUserStoreLoad(user.id)
    }
  })

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="(global)"
        options={{ presentation: 'transparentModal' }}
      />
    </Stack>
  )
}

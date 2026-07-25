import { useObserve } from '@legendapp/state/react'
import { Stack } from 'expo-router'

import { COLORS } from '@/constants/constants'
import { authUser$, profile$, profileUserStoreLoad } from '@/services/legend'

export default function MainLayout() {
  useObserve(() => {
    const userId = authUser$.get()?.id
    if (userId) {
      const storeData = profile$[userId].user_store.get()
      if (storeData) {
        profileUserStoreLoad(userId)
      }
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
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'none',
          contentStyle: { backgroundColor: COLORS.TRANSPARENT },
        }}
      />
    </Stack>
  )
}

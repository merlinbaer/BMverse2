import { Stack } from 'expo-router'
import { useSupabase } from '@/hooks/useSupabase'
import { useEffect } from 'react'
import { getStoreVersion } from '@/stores/supabaseStore'

export default function ProtectedLayout() {
  const { supabase, session } = useSupabase()

  useEffect(() => {
    if (supabase && session) {
      // Signed in: initialize + kick off persist load early (local-first)
      const { version$ } = getStoreVersion(supabase)
      version$.peek()
    }
  }, [supabase, session])

  return (
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
  )
}

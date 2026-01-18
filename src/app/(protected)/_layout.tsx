import { Stack } from 'expo-router'
import { useSupabase } from '@/hooks/useSupabase'
import { useEffect } from 'react'
import { getStores } from '@/stores/supabaseStore'

export default function ProtectedLayout() {
  const { supabase, session } = useSupabase()
  useEffect(() => {
    if (supabase && session) {
      getStores(supabase)
    }
  }, [supabase])

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

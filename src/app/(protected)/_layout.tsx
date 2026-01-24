import { Stack } from 'expo-router'
import { useSupabase } from '@/hooks/useSupabase'
import { useEffect } from 'react'
import { initializeDatabaseStates } from '@/services/initServices'

export default function ProtectedLayout() {
  const { supabase, session } = useSupabase()

  useEffect(() => {
    if (supabase && session) {
      initializeDatabaseStates(supabase)
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

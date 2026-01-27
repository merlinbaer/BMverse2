import { Stack } from 'expo-router'
import { useEffect } from 'react'

import { useSupabase } from '@/hooks/useSupabase'
import { initializeDatabaseStates } from '@/services/initServices'
// import { useEffect } from 'react'

// import { useSupabase } from '@/hooks/useSupabase'
// import { initializeDatabaseStates } from '@/services/initServices'

export default function ProtectedLayout() {
  const { supabase, session } = useSupabase()

  useEffect(() => {
    if (supabase && session) {
      initializeDatabaseStates(supabase, session)
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

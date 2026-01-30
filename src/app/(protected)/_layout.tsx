import { Stack } from 'expo-router'
import { useEffect, useMemo } from 'react'

import { useSupabase } from '@/hooks/useSupabase'
import { initializeDatabaseStates } from '@/services/initServices'
import {
  getStoreProfile,
  getStoreSync,
  getStoreVersion,
  GlobalStoreContext,
} from '@/stores/globalStore'

export default function ProtectedLayout() {
  const { supabase, session } = useSupabase()

  const stores = useMemo(() => {
    if (!supabase || !session) return null
    return {
      sync: getStoreSync(supabase, session),
      version: getStoreVersion(supabase),
      profile: getStoreProfile(supabase, session),
    }
  }, [supabase, session])

  useEffect(() => {
    if (stores && supabase && session) {
      // Pass the singleton instances to the init service
      initializeDatabaseStates(stores)
    }
  }, [stores, supabase, session])

  if (!stores) return null

  return (
    <GlobalStoreContext.Provider value={stores}>
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
    </GlobalStoreContext.Provider>
  )
}

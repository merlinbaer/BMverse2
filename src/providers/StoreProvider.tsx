import { ReactNode, useEffect, useMemo } from 'react'

import { StoreContext, StoreContextType } from '@/contexts/legendstate'
import { useSupabase } from '@/hooks/useSupabase'
import { startSyncCoordinator } from '@/services/initServices'
import {
  getStoreProfile,
  getStoreSync,
  getStoreVersion,
} from '@/stores/globalStore'
import { getStoreNews } from '@/stores/newsStore'

/* ---------------------------- Types ---------------------------- */
interface StoreProviderProps {
  children: ReactNode
}

/* ------------------------ Store  Provider ------------------------ */
export const StoreProvider = ({ children }: StoreProviderProps) => {
  const { supabase, session } = useSupabase()

  // Create all singleton instances of the database stores
  const stores: StoreContextType | null =
    useMemo((): StoreContextType | null => {
      if (!supabase || !session) return null
      return {
        sync: getStoreSync(supabase),
        version: getStoreVersion(supabase),
        profile: getStoreProfile(supabase, session),
        news: getStoreNews(supabase),
      }
    }, [supabase, session])

  useEffect(() => {
    if (stores && supabase && session) {
      // Warm up store data
      stores.sync.data$.peek()
      stores.version.data$.peek()
      stores.profile.data$.peek()
      stores.news.data$.peek()
      // Start cascading sync mechanism
      const stop = startSyncCoordinator(stores)
      return () => stop?.()
    }
  }, [stores, supabase, session])

  if (!stores) return null

  /* ------------------ Render ------------------ */
  return (
    <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
  )
}

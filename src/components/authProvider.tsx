// AuthProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createClient,
  processLock,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'

/* ---------------------------- Types ---------------------------- */

interface SupabaseProviderProps {
  children: ReactNode
}

interface SupabaseContextType {
  supabase: SupabaseClient
  session: Session | null
  restoring: boolean
}

/* --------------------------- Context --------------------------- */

export const SupabaseContext = createContext<SupabaseContextType | null>(null)

/* ------------------------ Auth Provider ------------------------ */

export const AuthProvider = ({ children }: SupabaseProviderProps) => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!

  const supabase = useMemo(
    () =>
      createClient(supabaseUrl, supabaseKey, {
        auth: {
          storage: AsyncStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          lock: processLock,
        },
      }),
    [],
  )

  const [session, setSession] = useState<Session | null>(null)
  const [restoring, setRestoring] = useState(true)

  /* ---------------------- Session Restore ---------------------- */

  useEffect(() => {
    let mounted = true

    // Initial Restore
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return

      setSession(data.session ?? null)
      setRestoring(false) // ⬅️ genau EINMAL hier
    }

    restoreSession()

    // Auth-Updates
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return
      setSession(newSession ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  /* --------------------------- Render -------------------------- */

  return (
    <SupabaseContext.Provider value={{ supabase, session, restoring }}>
      {children}
    </SupabaseContext.Provider>
  )
}

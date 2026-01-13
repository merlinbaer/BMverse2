// AuthProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js'
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
  const noOpLock = async (
    name: string,
    acquireTimeout: number,
    fn: () => Promise<any>,
  ) => {
    return await fn()
  }

  /* ------------------ Supabase Client ------------------ */
  const supabase = useMemo(
    () =>
      createClient(supabaseUrl, supabaseKey, {
        auth: {
          storage: AsyncStorage,
          persistSession: true,
          autoRefreshToken: true, // Internal token refresh
          detectSessionInUrl: false,
          lock: noOpLock, // Default lock for Token processLock
        },
      }),
    [],
  )

  /* ------------------ State ------------------ */
  const [session, setSession] = useState<Session | null>(null)
  const [restoring, setRestoring] = useState(true)

  /* ------------------ Session Restore ------------------ */
  useEffect(() => {
    let mounted = true // avoid race conditions
    let restored = false // Ensures that getSession only runs once

    const restoreSession = async () => {
      if (restored || !mounted) return
      restored = true
      try {
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        setSession(data.session ?? null)
      } catch (error) {
        console.error('Error restoring Supabase session:', error)
        setSession(null)
      } finally {
        if (mounted) setRestoring(false)
      }
    }

    restoreSession()

    /* ------------------ Auth-Updates ------------------ */
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

  /* ------------------ Render ------------------ */
  return (
    <SupabaseContext.Provider value={{ supabase, session, restoring }}>
      {children}
    </SupabaseContext.Provider>
  )
}

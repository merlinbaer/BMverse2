// AuthProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'

import { AUTH } from '@/constants/constants'
import { Database } from '@/types/database.types'

/* ---------------------------- Types ---------------------------- */
interface SupabaseProviderProps {
  children: ReactNode
}

interface SupabaseContextType {
  supabase: SupabaseClient<Database>
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
    _name: string,
    _acquireTimeout: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: () => Promise<any>,
  ) => {
    return await fn()
  }

  /* ------------------ Supabase Client ------------------ */
  const supabase = useMemo(
    () =>
      createClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          storageKey: AUTH.STORAGE_KEY, // storage key for token
          storage: AsyncStorage,
          persistSession: true,
          autoRefreshToken: true, // Internal token refresh
          detectSessionInUrl: false,
          lock: noOpLock, // Default lock for Token processLock
        },
      }),
    [supabaseKey, supabaseUrl],
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
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Session restore error:', error.message)
          if (
            error.message.includes('Refresh Token Not Found') ||
            error.message.includes('invalid_grant') ||
            error.message.includes('expired')
          ) {
            console.log('Auth: Token expired or invalid - clearing session')
            await supabase.auth.signOut({ scope: 'local' }) // Only clear locally
          }
        }
        if (!mounted) return
        setSession(data.session ?? null)
      } catch (error) {
        console.error('Auth: Error restoring session:', error)
        setSession(null)
      } finally {
        if (mounted) setRestoring(false)
      }
    }

    void restoreSession()

    /* ------------------ Auth-Updates ------------------ */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return
      // Update last seen on login or token refresh
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        ;(async () => {
          try {
            const { error } = await supabase.rpc('update_last_seen')
            if (error) {
              console.log('Auth: update_last_seen not possible.', error.message)
            }
          } catch (err) {
            console.log('Auth: update_last_seen not possible.', err)
          }
        })()
      }

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

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!

// Only enable auth persistence if we are in a client environment (not Node/Build time)
const isSSR = typeof window === 'undefined'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isSSR ? undefined : AsyncStorage,
    autoRefreshToken: !isSSR,
    persistSession: !isSSR,
    detectSessionInUrl: !isSSR,
  },
  realtime: isSSR
    ? {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transport: class {} as any,
      }
    : undefined,
})

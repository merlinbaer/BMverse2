import { observable } from '@legendapp/state'

import { clearCacheNews, syncNews } from './legend'
import { supabase } from './supabase'

// Reactive auth state — subscribe with useValue(authUser$) in any component
export const authUser$ = observable<string | null>(null)

// Call once at app startup in _layout.tsx
export function initAuth() {
  supabase.auth.getSession().then(({ data }) => {
    authUser$.set(data.session?.user?.email ?? null)
  })

  supabase.auth.onAuthStateChange((event, session) => {
    authUser$.set(session?.user?.email ?? null)
    if (event === 'SIGNED_IN') {
      void syncNews()
    }
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      if (!session) {
        // Token refresh failed or explicit sign-out — clean up
        void clearCacheNews()
        void forceLocalLogout()
      }
    }
  })
}

export const startLogin = async (email: string) => {
  if (await supabase.auth.getUser().then(u => u.data.user != null)) return
  await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  })
}

export const verifyOtp = async (email: string, token: string, retries = 3) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const { error, data } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (!error) return data.session

    const isFinalError =
      error.message.includes('invalid') || error.message.includes('expired')
    const isLastAttempt = attempt === retries

    if (isFinalError || isLastAttempt) throw error

    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
  }
}

export const signOut = async () => {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.warn('supabase signOut failed, forcing local reset.', error)
  }
}

const forceLocalLogout = async () => {
  authUser$.set(null)
  try {
    await supabase.auth.signOut({ scope: 'local' }) // only clear local session, don't call server
  } catch {
    // Server is already gone for this user, ignore
  }
}

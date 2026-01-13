import { useSupabase } from '@/hooks/useSupabase'

export const useAuth = () => {
  const { supabase, session, restoring } = useSupabase()

  if (!supabase) throw new Error('useAuth must be used within AuthProvider')

  /**
   * Start OTP Login / Signup
   * shouldCreateUser = true ensures that new users are created automatically
   */
  const startLogin = async (email: string) => {
    if (restoring)
      throw new Error('Supabase session is restoring. Please wait.')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) throw error
  }

  /**
   * Verifies OTP code and creates a session
   */
  const verifyOtp = async (email: string, token: string) => {
    if (restoring)
      throw new Error('Supabase session is restoring. Please wait.')

    const { error, data } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) throw error

    // Session is automatically set by the AuthProvider via onAuthStateChange
    return data.session
  }

  /**
   * Sign Out
   */
  const signOut = async () => {
    if (restoring) throw new Error('Cannot sign out while restoring session.')

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    restoring, // true as long as the session is being loaded
    session, // current session or null
    startLogin,
    verifyOtp,
    signOut,
  }
}

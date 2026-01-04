import { useSupabase } from './useSupabase'

export const useAuth = () => {
  const { isLoaded, supabase } = useSupabase()

  /**
   * Start OTP Login / Signup
   * shouldCreateUser = true sorgt dafür, dass neue User automatisch angelegt werden
   */
  const startLogin = async (email: string) => {
    if (!isLoaded) throw new Error('Init-Auth-Login: Supabase not loaded')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) throw error
  }

  /**
   * Verifiziere OTP Code und erzeugt Session
   */
  const verifyOtp = async (email: string, token: string) => {
    if (!isLoaded) throw new Error('Init-Auth-Verify: Supabase not loaded')

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) throw error
  }

  /**
   * Sign Out
   */
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    isLoaded,
    startLogin,
    verifyOtp,
    signOut,
  }
}

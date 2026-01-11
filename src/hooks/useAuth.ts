import { useSupabase } from '@/hooks/useSupabase'

export const useAuth = () => {
  const { supabase, session, restoring } = useSupabase()

  if (!supabase) throw new Error('useAuth must be used within AuthProvider')

  /**
   * Start OTP Login / Signup
   * shouldCreateUser = true sorgt dafür, dass neue User automatisch angelegt werden
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
   * Verifiziere OTP Code und erzeugt Session
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

    // Session wird automatisch vom AuthProvider über onAuthStateChange gesetzt
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
    restoring, // true, solange Session geladen wird
    session, // aktuelle Session oder null
    startLogin,
    verifyOtp,
    signOut,
  }
}

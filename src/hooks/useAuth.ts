import { useSupabase } from '@/hooks/useSupabase'
import { AUTH_STORAGE_KEY } from '@/constants/constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DevSettings, Platform } from 'react-native'
import * as Updates from 'expo-updates'

export const useAuth = () => {
  const { supabase, session, restoring } = useSupabase()

  if (!supabase) throw new Error('useAuth must be used within AuthProvider')

  /**
   * Clears storage and restarts the app to guarantee a clean state
   */
  const forceLogout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
      console.log('Info: AUTH_STORAGE_KEY cleared')
      if (Platform.OS === 'web') {
        console.log('Info: Reloading web app...')
        window.location.reload()
      } else {
        if (__DEV__) {
          console.log('Info: Reloading expo app using DevSettings.reload()')
          DevSettings.reload()
        } else {
          console.log('Info: Reloading native app using Updates.reloadAsync()')
          await Updates.reloadAsync()
        }
      }
    } catch (err) {
      console.error('Hard reset failed', err)
    }
  }

  /**
   * Start OTP Login / Signup
   * shouldCreateUser = true ensures that new users are created automatically
   */
  const startLogin = async (email: string) => {
    if (restoring) return

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
    if (restoring) return

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
    if (restoring) return

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('Supabase signOut failed, forcing local reset.')
    } finally {
      await forceLogout()
    }
  }

  /**
   * Deletes the current user's account via RPC
   */
  const deleteAccount = async () => {
    if (restoring) return

    try {
      const { error } = await supabase.rpc('delete_user')
      if (error) {
        console.error('Info: delete_user server call failed:', error.message)
      }
    } catch (error) {
      console.error('Info: Network or unexpected error during delete:', error)
    } finally {
      console.warn('Info: Delete account is now forcing local reset.')
      await forceLogout()
    }
  }

  return {
    restoring, // true as long as the session is being loaded
    session, // current session or null
    startLogin,
    verifyOtp,
    signOut,
    deleteAccount,
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthResponse } from '@supabase/supabase-js'
import * as Updates from 'expo-updates'
import { DevSettings, Platform } from 'react-native'

import { AUTH } from '@/constants/constants'
import { authUser$, isAuthLoaded$ } from '@/services/legend/memory/variables'

import { supabase } from './supabase'

/**
 * Initial Authentication, Check if session is available
 * Call once at app startup in _layout.tsx
 */
export function initAuth() {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Session restore error:', error.message)
      if (
        error.message.includes('Invalid Refresh Token') ||
        error.message.includes('Refresh Token Not Found') ||
        error.message.includes('invalid_grant') ||
        error.message.includes('expired')
      ) {
        console.log('Auth: Token expired or invalid - clearing session')
        supabase.auth.signOut({ scope: 'local' }).then() // Only clear locally
      }
    }
    if (data.session?.user?.email) {
      authUser$.set(data.session?.user?.email)
      console.log('Auth: User logged in.')
    } else {
      authUser$.set(null)
      console.log('Auth: No user session found.')
    }
    isAuthLoaded$.set(true) // Mark as finished
  })

  // Add listener
  supabase.auth.onAuthStateChange((event, session) => {
    //debug: console.log('supabase auth state change:', event, session)
    authUser$.set(session?.user?.email ?? null) // important setting authUser$
    isAuthLoaded$.set(true) // Ensure it's true if a listener event happens first
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      ;(async () => {
        try {
          const { error } = await supabase.rpc('update_last_seen')
          if (error) {
            console.log('Auth: update_last_seen not possible.', error.message)
          } else {
            console.log('Auth: update_last_seen successful.')
          }
        } catch (err) {
          console.log('Auth: update_last_seen not possible caught.', err)
        }
      })()
    }
    // ToDo: Token refreshed and session ended externally restart app
    /* // Sync profile data when signed in.
    if (event === 'SIGNED_IN') {
      void syncProfile()
    }
    */
  })
}

/**
 * Start OTP Login / Signup
 * shouldCreateUser = true ensures that new users are created automatically
 */
export const startLogin = async (email: string) => {
  if (await supabase.auth.getUser().then(u => u.data.user != null)) return
  /*
  await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  })
  */
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error('Timeout. Please check your connection.')),
      AUTH.OTP_TIMEOUT_MS,
    ),
  )

  const loginPromise = supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  })

  const { error } = await Promise.race<AuthResponse>([
    loginPromise,
    timeoutPromise as Promise<AuthResponse>,
  ])

  if (error) throw error
}

/**
 * Verify OTP with retry logic
 */
export const verifyOtp = async (
  email: string,
  token: string,
  retries = AUTH.MAX_RETRY_ATTEMPTS,
) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const { error, data } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    // Verify OK
    if (!error) {
      return data.session
    }

    // Handle specific errors that should NOT be retried
    const isFinalError =
      error.message.includes('invalid') || error.message.includes('expired')
    const isLastAttempt = attempt === retries

    if (isFinalError || isLastAttempt) throw error

    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
  }
}

/**
 * Sign Out
 */
export const signOut = async () => {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.warn('Auth: supabase signOut failed, forcing local reset.', error)
    try {
      await supabase.auth.signOut({ scope: 'local' }) // only clear local session, don't call server
    } catch {
      console.log('Auth: supabase local sign out failed, ignoring.')
    }
  } finally {
    await forceLogout()
  }
}

/**
 * Deletes the current user's account via RPC
 */
export const deleteAccount = async () => {
  try {
    const { error } = await supabase.rpc('delete_user')
    if (error) {
      console.error('Auth: delete_user server call failed:', error.message)
    }
  } catch (error) {
    console.error('Auth: Network or unexpected error during delete:', error)
  } finally {
    console.warn('Auth: Delete account is now forcing local reset.')
    await forceLogout()
  }
}

/**
 * Clears storage and restarts the app to guarantee a clean state
 */
export const forceLogout = async () => {
  try {
    await AsyncStorage.removeItem(AUTH.STORAGE_KEY)
    console.log('Auth: AUTH_STORAGE_KEY cleared')
    authUser$.set(null)
    if (Platform.OS === 'web') {
      console.log('Auth: Reloading web app...')
      window.location.reload()
    } else {
      if (__DEV__) {
        console.log('Auth: Reloading expo app using DevSettings.reload()')
        DevSettings.reload()
      } else {
        console.log('Auth: Reloading native app using Updates.reloadAsync()')
        await Updates.reloadAsync()
      }
    }
  } catch (err) {
    console.error('Auth: Reload app failed', err)
  }
}

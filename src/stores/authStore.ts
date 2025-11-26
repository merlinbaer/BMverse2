import { observable } from '@legendapp/state';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

const STORAGE_KEY = 'authStore';

export const authStore = observable({
  user: null as any | null,
  session: null as any | null,
});

// Laden persistent + aktuelle Supabase Session
export async function loadAuthStore() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const data = JSON.parse(json);
      authStore.user.set(data.user ?? null);
      authStore.session.set(data.session ?? null);
    }

    // Supabase Session prüfen (Magic Link könnte gesetzt sein)
    const { data } = await supabase.auth.getSession();
    authStore.user.set(data.session?.user ?? null);
    authStore.session.set(data.session ?? null);

  } catch (e) {
    console.warn('Failed to load authStore', e);
  }
}

export async function saveAuthStore() {
  try {
    const data = { user: authStore.user.get(), session: authStore.session.get() };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save authStore', e);
  }
}

// Auto-Save
authStore.user.onChange(saveAuthStore);
authStore.session.onChange(saveAuthStore);

// Magic Link Login
export async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({ 
    email, 
    options: { emailRedirectTo: 'http://localhost:8081/callback' } 
  });
  if (error) throw error;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';


import Constants from 'expo-constants';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ? process.env.EXPO_PUBLIC_SUPABASE_URL : '';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY : ''

console.log("Log :" + SUPABASE_URL)

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export async function testClient() {
  const { data, error } = await supabase.from('bm_songs').select('*').limit(1);
  if (error) {
    console.error('Supabase client test failed:', error);
  } else {
    console.log('Supabase client works! Sample data:', data);
  }
}

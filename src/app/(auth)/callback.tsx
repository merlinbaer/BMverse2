// src/app/(auth)/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../services/supabase';
import { authStore } from '../../stores/authStore';

export default function CallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    async function handleMagicLink() {
      // Extract fragment from URL
      const hash = window.location.hash; // e.g. #access_token=XYZ&refresh_token=ABC&expires_in=3600
      const params = new URLSearchParams(hash.replace('#', ''));

      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      console.log('access_token: ' + access_token)

      if (access_token && refresh_token) {
        // Manually set session
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.log('Failed to set session:', error.message);
          return;
        }

        // Now get the session
        const { data } = await supabase.auth.getSession();
        console.log('data.session: ' + JSON.stringify(data.session))
        authStore.session.set(data.session ?? null);
        authStore.user.set(data.session?.user ?? null);

        // Navigate to tabs
        router.replace('/');
      } else {
        console.log('Magic link parameters missing in URL hash.');
      }
    }

    handleMagicLink();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Signing you in… Please wait.</p>
    </div>
  );
}

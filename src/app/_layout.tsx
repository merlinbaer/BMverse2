import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { authStore } from '../stores/authStore';
import { onboardingStore } from '../stores/onboardingStore';

export default function RootLayout() {
  const router = useRouter();

  /* useEffect(() => {
    // Wenn User nicht eingeloggt oder Onboarding nicht abgeschlossen → zu Auth oder Onboarding
    if (!onboardingStore.completed.get()) {
      router.replace('(onboarding)/step1');
    } else if (!authStore.user.get()) {
      router.replace('(auth)/sign-in');
    }
  }, [authStore.user.get(), onboardingStore.completed.get()]);
 */
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!onboardingStore.completed.get() && (
        <Stack.Screen name="(onboarding)/step1" />
      )}

      {onboardingStore.completed.get() && !authStore.user.get() && (
        <Stack.Screen name="(auth)/sign-in" />
      )}
      <Stack.Screen name="(auth)/callback" />

      {/* Protected Tabs */}
      <Stack.Protected guard={authStore.user.get() !== null && onboardingStore.completed.get()}>
        <Stack.Screen name="(tabs)/_layout" />
      </Stack.Protected>
    </Stack>
  );
}

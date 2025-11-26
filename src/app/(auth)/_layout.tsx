import { Stack } from 'expo-router';
import { authStore } from '../../stores/authStore';
import { onboardingStore } from '../../stores/onboardingStore';
import SignInScreen from './sign-in';
import CallbackScreen from './callback';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="callback" options={{ title: 'Magic Link Callback' }} />
    </Stack>
  );
}

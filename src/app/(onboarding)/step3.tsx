import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { onboardingStore } from '../../stores/onboardingStore';

export default function OnboardingStep3() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Onboarding - Step 3</Text>
      <Button
        title="Starten"
        onPress={() => {
          onboardingStore.completed.set(true);
          router.replace('/(auth)/sign-in');
        }}
      />
    </View>
  );
}

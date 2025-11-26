import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { onboardingStore } from '../../stores/onboardingStore';

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Willkommen zum Onboarding - Step 1</Text>
      <Button
        title="Weiter"
        onPress={() => router.push('/(onboarding)/step2')}
      />
    </View>
  );
}

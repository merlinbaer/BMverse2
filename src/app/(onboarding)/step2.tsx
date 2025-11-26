import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingStep2() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Onboarding - Step 2</Text>
      <Button
        title="Weiter"
        onPress={() => router.push('/(onboarding)/step3')}
      />
    </View>
  );
}

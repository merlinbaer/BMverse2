import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/utils/authStore";
import React from "react";

export default function OnboardingFinalScreen() {
  const { completeOnboarding } = useAuthStore();

  return (
    <View>
      <AppText center size="heading">
        Onboarding Screen 2
      </AppText>
      <Button title="Complete onboarding" onPress={completeOnboarding} />
    </View>
  );
}

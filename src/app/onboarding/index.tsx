import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Link } from "expo-router";
import { Button } from "@/components/Button";
import React from "react";

export default function OnboardingFirstScreen() {
  return (
    <View>
      <AppText center size="heading">
        Onboarding Screen 1
      </AppText>
      <Link asChild push href="/onboarding/final">
        <Button title="Go to screen 2" />
      </Link>
    </View>
  );
}

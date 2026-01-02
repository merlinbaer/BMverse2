import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/utils/authStore";
import React from "react";

export default function SettingsScreen() {
  const { logOut } = useAuthStore();

  return (
    <View>
      <AppText center size="heading">
        Settings Screen
      </AppText>
      <Button title="Sign out" onPress={logOut} />
    </View>
  );
}

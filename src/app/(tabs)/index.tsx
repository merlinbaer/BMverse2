import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Link } from "expo-router";
import { Button } from "@/components/Button";
import React from "react";

export default function IndexScreen() {
  return (
    <View>
      <AppText center size="heading">
        Home Screen
      </AppText>
      <Link asChild push href="/modal">
        <Button title="Open modal" />
      </Link>
    </View>
  );
}

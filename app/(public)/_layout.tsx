import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function PublicLayout() {
  return (
    <Stack initialRouteName="welcome">
      <Stack.Screen
        name="welcome"
        options={{
          title: "Welcome",
          headerTransparent: Platform.OS === "ios",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerTransparent: Platform.OS === "ios",
          headerLargeTitle: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          title: "Verify",
          headerTransparent: Platform.OS === "ios",
          headerLargeTitle: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}

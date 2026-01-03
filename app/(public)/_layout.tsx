import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack initialRouteName="welcome">
      <Stack.Screen
        name="welcome"
        options={{
          title: "Welcome",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          title: "Verify",
          headerLargeTitle: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}

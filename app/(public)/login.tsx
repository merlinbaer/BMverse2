import { useState } from "react";
import { Text, TextInput, Button, ScrollView, Alert } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";

export default function SignUpPage() {
  const { isLoaded, startLogin } = useAuth();
  const [email, setEmail] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded || !email) return;

    try {
      await startLogin(email);
      setEmail("");
      router.push(`/verify?email=${email}`);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to start login");
    }
  };

  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 8 }}
    >
      <Text>Email Address:</Text>
      <TextInput
        autoCapitalize="none"
        value={email}
        placeholder="Enter email"
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Continue" onPress={onSignUpPress} disabled={!email} />
    </ScrollView>
  );
}

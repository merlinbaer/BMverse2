import { useState } from "react";
import { Text, TextInput, Button, ScrollView, Alert } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";

export default function SignUpPage() {
  const { isLoaded, startLogin } = useAuth();
  const [email, setEmail] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onSignUpPress = async () => {
    if (!isLoaded || !email) return;
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    try {
      await startLogin(email);
      setEmail("");
      router.push(`/verify?email=${email}`);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send email.");
    }
  };

  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 32, gap: 16 }}
    >
      <Text>Email Address:</Text>
      <TextInput
        autoCapitalize="none"
        value={email}
        placeholder="Enter email"
        style={{ borderWidth: 1, padding: 10 }}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Continue" onPress={onSignUpPress} disabled={!email} />
    </ScrollView>
  );
}

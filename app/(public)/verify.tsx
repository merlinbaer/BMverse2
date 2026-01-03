import { useState } from "react";
import { Text, TextInput, Button, ScrollView, Alert } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useLocalSearchParams } from "expo-router";

export default function VerifyPage() {
  const { isLoaded, verifyOtp } = useAuth();
  const [token, setToken] = useState("");

  const params = useLocalSearchParams();
  const email: string = Array.isArray(params.email) ? "" : params.email;

  const onVerifyPress = async () => {
    if (!isLoaded || !token) return;

    try {
      await verifyOtp(email, token);
      setToken("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Invalid code");
    }
  };

  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 32, gap: 16 }}
    >
      <Text>Enter the verification code sent to your email:</Text>
      <TextInput
        value={token}
        placeholder="8-digit code"
        style={{ borderWidth: 1, padding: 10 }}
        keyboardType="number-pad"
        onChangeText={setToken}
        maxLength={8}
      />
      <Button
        title="Verify"
        onPress={onVerifyPress}
        disabled={token.length !== 8}
      />
    </ScrollView>
  );
}

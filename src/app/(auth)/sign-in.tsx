import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { sendMagicLink } from '../../stores/authStore';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSendLink = async () => {
    try {
      await sendMagicLink(email);
      setStatus('Magic Link gesendet! Bitte Email prüfen.');
    } catch (e: any) {
      setStatus('Fehler: ' + e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text>Email:</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 }}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Magic Link senden" onPress={handleSendLink} />
      {status ? <Text style={{ marginTop: 12 }}>{status}</Text> : null}
    </View>
  );
}

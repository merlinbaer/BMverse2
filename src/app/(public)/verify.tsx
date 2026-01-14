import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { COLORS, LAYOUT } from '@/constants/constants'
import { useAuth } from '@/hooks/useAuth'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, Platform, StyleSheet, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function VerifyPage() {
  const { restoring, verifyOtp } = useAuth()
  const [token, setToken] = useState('')

  const params = useLocalSearchParams()
  const email: string = Array.isArray(params.email) ? '' : params.email

  const onVerifyPress = async () => {
    if (restoring || !token) return

    try {
      await verifyOtp(email, token)
      setToken('')
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Invalid code')
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <AppText>Enter the verification code sent to your email:</AppText>
      <TextInput
        value={token}
        placeholder="Enter 8-digit code"
        placeholderTextColor={COLORS.TEXT_MUTED}
        style={styles.textInput}
        onChangeText={setToken}
        keyboardType="number-pad"
        maxLength={8}
      />
      <AppButton
        title="Verify"
        onPress={onVerifyPress}
        disabled={token.length !== 8}
      />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  keyboardAwareScrollView: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardAwareContentContainer: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    gap: LAYOUT.gap,
    paddingTop: Platform.select({
      ios: 180,
      android: 20,
      default: 10,
    }),
    paddingBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
})

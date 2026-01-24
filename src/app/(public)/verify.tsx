import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Platform, StyleSheet, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { AUTH, COLORS, LAYOUT } from '@/constants/constants'
import { useAlert } from '@/hooks/useAlert'
import { useAuth } from '@/hooks/useAuth'

export default function VerifyPage() {
  const { restoring, verifyOtp } = useAuth()
  const { showAlert } = useAlert()
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const params = useLocalSearchParams()
  const email: string = Array.isArray(params.email) ? '' : params.email

  const onVerifyPress = async () => {
    if (restoring || !token || isLoading) return

    setIsLoading(true)
    try {
      await verifyOtp(email, token)
      setToken('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid code'
      showAlert('Error', message)
    } finally {
      setIsLoading(false)
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
        maxLength={AUTH.OTP_LENGTH}
      />
      <AppButton
        title="Verify"
        onPress={onVerifyPress}
        disabled={token.length !== AUTH.OTP_LENGTH}
      />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  keyboardAwareContentContainer: {
    gap: LAYOUT.gap,
    paddingBottom: 24,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 180,
      android: 20,
      default: 10,
    }),
  },
  keyboardAwareScrollView: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  textInput: {
    backgroundColor: COLORS.TEXT_INPUT,
    borderWidth: 1,
    padding: 10,
  },
})

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { ScreenContainerFixed } from '@/components/ScreenContainerFixed'
import { COLORS, LAYOUT } from '@/constants/constants'
import { useAuth } from '@/hooks/useAuth'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, StyleSheet, TextInput } from 'react-native'

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
    <ScreenContainerFixed>
      <AppText>Enter the verification code sent to your email:</AppText>
      <TextInput
        value={token}
        placeholder="8-digit code"
        style={{ borderWidth: 1, padding: 10, backgroundColor: 'white' }}
        keyboardType="number-pad"
        onChangeText={setToken}
        maxLength={8}
      />
      <AppButton
        title="Verify"
        onPress={onVerifyPress}
        disabled={token.length !== 8}
      />
    </ScreenContainerFixed>
  )
}
StyleSheet.create({
  scrollArea: {
    flex: 1, // fills the available space
    backgroundColor: COLORS.SCROLLVIEW,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  scrollContent: {
    gap: LAYOUT.gap,
    paddingVertical: 12,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
})

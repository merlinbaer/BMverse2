import { useValue } from '@legendapp/state/react'
import { useState } from 'react'
import { Platform, StyleSheet, TextInput, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { AUTH, COLORS, LAYOUT } from '@/constants/constants'
import { useAlert } from '@/hooks/useAlert'
import { deleteAccount, signOut, startLogin, verifyOtp } from '@/services/auth'
import { authUser$ } from '@/services/legend/memory/variables'

export default function ProfileScreen() {
  const email = 'web@bruu.eu'
  const { showAlert } = useAlert()
  const [token, setToken] = useState('')
  const user = useValue(authUser$)

  const onVerifyPress = async () => {
    if (!token) return
    try {
      await verifyOtp(email, token)
      setToken('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid code'
      console.log('Error', message)
    }
  }

  const onLogoutPress = async () => {
    try {
      await signOut()
      setToken('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed'
      console.log('Error', message)
    }
  }

  const handleDeleteAccount = async () => {
    showAlert(
      'Delete Account',
      'Are you sure you want to permanently delete your account with all user data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount()
          },
        },
      ],
    )
  }

  return (
    <View style={styles.mainView}>
      <AppButton title={`Request Token`} onPress={() => startLogin(email)} />
      <AppText>Enter the verification code sent to your email:</AppText>
      <TextInput
        value={token}
        placeholder={`Enter ${AUTH.OTP_LENGTH}-digit code`}
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
      <AppButton title="Logout" onPress={onLogoutPress} disabled={!user} />
      <AppButton
        title="Delete Account"
        onPress={handleDeleteAccount}
        disabled={!user}
      />
      <AppText>User: {user ?? 'not logged in'}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
    gap: LAYOUT.gap,
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 170,
      android: 20,
      default: 10,
    }),
  },
  textInput: {
    backgroundColor: COLORS.TEXT_INPUT,
    borderWidth: 1,
    padding: 10,
  },
})

import { useValue } from '@legendapp/state/react'
import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { COLORS, LAYOUT } from '@/constants/constants'
import { authUser$, signOut, startLogin, verifyOtp } from '@/services/auth'

export default function ProfileScreen() {
  const email = 'web@bruu.eu'
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

  return (
    <View style={styles.mainView}>
      <AppButton title={`Request Token`} onPress={() => startLogin(email)} />
      <AppText>Enter the verification code sent to your email:</AppText>
      <TextInput
        value={token}
        placeholder="Enter 8-digit code"
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
      <AppButton title="Logout" onPress={onLogoutPress} disabled={!user} />
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
    paddingTop: 20,
  },
  textInput: {
    backgroundColor: COLORS.TEXT_INPUT,
    borderWidth: 1,
    padding: 10,
  },
})

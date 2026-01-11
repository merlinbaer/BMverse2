import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { ScreenContainerFixed } from '@/components/ScreenContainerFixed'
import { COLORS, LAYOUT } from '@/constants/constants'
import privacyText from '@/constants/privacy'
import { useAuth } from '@/hooks/useAuth'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, TextInput } from 'react-native'
import Markdown from 'react-native-markdown-display'

export default function LoginPage() {
  const { restoring, startLogin } = useAuth()
  const [email, setEmail] = useState('')

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const onSignUpPress = async () => {
    if (restoring || !email) return
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.')
      return
    }
    try {
      await startLogin(email)
      setEmail('')
      router.push(`/verify?email=${email}`)
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send email.')
    }
  }

  return (
    <ScreenContainerFixed>
      <AppText>Please read the Privacy Policy & Login:</AppText>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Markdown>{privacyText}</Markdown>
      </ScrollView>
      <TextInput
        autoCapitalize="none"
        value={email}
        placeholder="Enter email"
        style={{ borderWidth: 1, padding: 10, backgroundColor: 'white' }}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <AppButton title="Accept & Send" onPress={onSignUpPress} />
    </ScreenContainerFixed>
  )
}

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1, // füllt den verfügbaren Platz
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

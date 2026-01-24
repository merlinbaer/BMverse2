import { router } from 'expo-router'
import { useState } from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Markdown from 'react-native-markdown-display'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { COLORS, LAYOUT } from '@/constants/constants'
import privacyText from '@/constants/privacy'
import { useAlert } from '@/hooks/useAlert'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { restoring, startLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { height } = useWindowDimensions()
  const { showAlert } = useAlert()

  // Calculate available height: screen height - top padding - other elements - gaps
  const textAreaHeight =
    height -
    Platform.select({
      ios: 160,
      android: 105,
      default: 70,
    }) -
    275

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const onSignUpPress = async () => {
    if (restoring || !email) return
    if (!isValidEmail(email)) {
      showAlert('Invalid Email', 'Please enter a valid email address.')
      return
    }
    setIsLoading(true) // Prevent double-tap
    try {
      await startLogin(email)
      const normalizedEmail = email.trim().toLowerCase()
      setEmail('')
      router.push(`/verify?email=${normalizedEmail}`)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to send email.'
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
      <AppText>Please read the Privacy Policy & Login:</AppText>
      <View style={[styles.privacyTextArea, { height: textAreaHeight }]}>
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={styles.privacyTextContentContainer}
        >
          <Markdown>{privacyText}</Markdown>
        </ScrollView>
      </View>
      <TextInput
        autoCapitalize="none"
        value={email}
        placeholder="Enter email"
        placeholderTextColor={COLORS.TEXT_MUTED}
        style={styles.textInput}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!isLoading} // Disable during loading
      />
      <AppButton
        title="Accept & Send"
        onPress={onSignUpPress}
        disabled={isLoading || !email}
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
      ios: 150,
      android: 20,
      default: 10,
    }),
  },
  keyboardAwareScrollView: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  privacyTextArea: {
    backgroundColor: COLORS.SCROLL_VIEW,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  },
  privacyTextContentContainer: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: 12,
  },
  textInput: {
    backgroundColor: COLORS.TEXT_INPUT,
    borderWidth: 1,
    padding: 10,
  },
})

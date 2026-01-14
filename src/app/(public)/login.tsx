import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { COLORS, LAYOUT } from '@/constants/constants'
import privacyText from '@/constants/privacy'
import { useAuth } from '@/hooks/useAuth'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import Markdown from 'react-native-markdown-display'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function LoginPage() {
  const { restoring, startLogin } = useAuth()
  const [email, setEmail] = useState('')
  const { height } = useWindowDimensions()

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
      />
      <AppButton title="Accept & Send" onPress={onSignUpPress} />
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
      ios: 150,
      android: 20,
      default: 10,
    }),
    paddingBottom: 24,
  },
  privacyTextArea: {
    backgroundColor: COLORS.SCROLL_VIEW,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  privacyTextContentContainer: {
    paddingVertical: 12,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
})

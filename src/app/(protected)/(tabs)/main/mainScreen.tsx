import { useState } from 'react'
import { Platform, StyleSheet, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { COLORS, LAYOUT } from '@/constants/constants'
import { useAlert } from '@/hooks/useAlert'

export default function MainScreen() {
  const [token, setToken] = useState('')
  const { showAlert } = useAlert()

  const handlePressMe = async () => {
    showAlert('Hi', 'Button pressed')
  }

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <AppText>Demopage:</AppText>
      <TextInput
        value={token}
        placeholder="Enter 3-digit code"
        placeholderTextColor={COLORS.TEXT_MUTED}
        style={styles.textInput}
        onChangeText={setToken}
        keyboardType="number-pad"
        maxLength={3}
      />
      <AppButton
        title="Press me"
        onPress={handlePressMe}
        disabled={token.length !== 3}
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

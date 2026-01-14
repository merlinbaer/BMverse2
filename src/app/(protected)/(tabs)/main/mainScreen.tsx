import { AppText } from '@/components/AppText'
import { useState } from 'react'
import { Alert, Platform, StyleSheet, TextInput } from 'react-native'
import { AppButton } from '@/components/AppButton'
import { COLORS, LAYOUT } from '@/constants/constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function MainScreen() {
  const [token, setToken] = useState('')

  const onVerifyPress = async () => {
    Alert.alert('Hi', 'Button pressed')
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
        onPress={onVerifyPress}
        disabled={token.length !== 3}
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

import { router } from 'expo-router'
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Markdown from 'react-native-markdown-display'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { COLORS, LAYOUT } from '@/constants/constants'
import privacyText from '@/constants/privacy'
import { localStore$ } from '@/services/legend/local/primitives'

export default function LoginPage() {
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

  const onPress = () => {
    localStore$.isOnboarding.set(false)
    router.replace(`/(onboarding)/welcome`)
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
      <AppButton title="Back" onPress={onPress} />
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
})

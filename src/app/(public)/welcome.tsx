import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { COLORS, LAYOUT } from '@/constants/constants'
import termsText from '@/constants/terms'
import { Link } from 'expo-router'
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import Markdown from 'react-native-markdown-display'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function WelcomePage() {
  const { height } = useWindowDimensions()

  // Calculate available height: screen height - top padding - other elements - gaps
  const textAreaHeight =
    height -
    Platform.select({
      ios: 160,
      android: 105,
      default: 70,
    }) -
    210

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <AppText>Please read the Terms and Conditions:</AppText>
      <View style={[styles.privacyTextArea, { height: textAreaHeight }]}>
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={styles.privacyTextContentContainer}
        >
          <Markdown>{termsText}</Markdown>
        </ScrollView>
      </View>
      <Link href="/login" asChild>
        <AppButton title="Accept" />
      </Link>
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
})

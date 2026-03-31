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
import termsText from '@/constants/terms'
import { localStore$ } from '@/services/legend/local/primitives'

export default function TermsPage() {
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

  const onPress = () => {
    localStore$.isFirstCall.set(false)
    router.replace(`/(firstCall)/welcome`)
  }

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <AppText>Please read the Terms and Conditions:</AppText>
      <View style={[styles.termsTextArea, { height: textAreaHeight }]}>
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={styles.termsTextContentContainer}
        >
          <Markdown>{termsText}</Markdown>
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
  termsTextArea: {
    backgroundColor: COLORS.SCROLL_VIEW,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  },
  termsTextContentContainer: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: 12,
  },
})

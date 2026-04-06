import { router } from 'expo-router'
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { TextHyperlink } from '@/components/TextHyperlink'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { localStore$ } from '@/services/legend/local/primitives'

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

  const onAcceptPress = () => {
    localStore$.isOnboarding.set(false)
    router.replace(`/(main)/(tabs)/news/newsScreen`)
  }
  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <AppText fontSize={FONT.SIZE.BASE}>
        Please read the Terms and Conditions:
      </AppText>
      <View style={[styles.WelcomeContentStyle, { height: textAreaHeight }]}>
        <AppText fontSize={FONT.SIZE.SM}>
          BMverse has no affiliation, association, endorsement, or any
          connection to BABYMETAL, or any of its subsidiaries or affiliates.
          BMverse makes no claim to and has no ownership interest in any
          intellectual property owned by BABYMETAL or any of its affiliates.
        </AppText>
        <AppText fontSize={FONT.SIZE.SM}>
          Music preview provided courtesy of iTunes. Album cover provided by
          Apple Music. Youtube Videos and thumbnail images are under the license
          terms of YouTube.
        </AppText>
        <TextHyperlink
          description={'Read Terms'}
          hyperlink={'https://bmverse.bruu.eu/privacy_and_terms'}
          type={'intern'}
          color={COLORS.TEXT_MUTED}
          size={FONT.SIZE.SM}
        />
        <TextHyperlink
          description={'Read Privacy'}
          hyperlink={'https://bmverse.bruu.eu/privacy_and_terms'}
          type={'intern'}
          color={COLORS.TEXT_MUTED}
          size={FONT.SIZE.SM}
        />
      </View>
      <AppButton title="Accept" onPress={onAcceptPress} />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  WelcomeContentStyle: {
    gap: 12,
    paddingBottom: 24,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  keyboardAwareContentContainer: {
    gap: LAYOUT.gap,
    paddingBottom: 24,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 170,
      android: 20,
      default: 10,
    }),
  },
  keyboardAwareScrollView: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
})

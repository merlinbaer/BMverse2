import { useValue } from '@legendapp/state/react'
import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppHyperlink } from '@/components/AppHyperlink'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { localStore$ } from '@/services/legend/local/primitives'

export default function WelcomePage() {
  const isVersion1Upgrade = useValue(localStore$.isVersion1Upgrade)

  const onAcceptPress = () => {
    localStore$.isOnboarding.set(false)
    localStore$.isVersion1Upgrade.set(false)
    router.replace(`/(main)/(tabs)/news/News`)
  }
  return (
    <AppScreen contentContainerStyle={styles.contentContainer}>
      <View style={styles.WelcomeContentStyle}>
        <AppText fontSize={FONT.SIZE.BASE}>
          Please read the Terms and Conditions:
        </AppText>
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
        <AppHyperlink
          description={'Read Terms'}
          hyperlink={'https://bmverse.bruu.eu/privacy_and_terms'}
          type={'intern'}
          color={COLORS.TEXT_MUTED}
          size={FONT.SIZE.SM}
        />
        <AppHyperlink
          description={'Read Privacy'}
          hyperlink={'https://bmverse.bruu.eu/privacy_and_terms'}
          type={'intern'}
          color={COLORS.TEXT_MUTED}
          size={FONT.SIZE.SM}
        />
        {isVersion1Upgrade && (
          <AppText fontSize={FONT.SIZE.SM} style={styles.UpgradeMessageStyle}>
            Important: This version is not compatible to previous versions.
            Previous added files and settings have been cleared.
          </AppText>
        )}
      </View>
      <AppButton title="Accept" onPress={onAcceptPress} />
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: LAYOUT.gap,
  },
  WelcomeContentStyle: {
    gap: 12,
    paddingBottom: 24,
    paddingTop: 12,
  },
  UpgradeMessageStyle: {
    color: COLORS.PRIMARY,
    paddingTop: 24,
  },
})

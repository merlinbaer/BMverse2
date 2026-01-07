import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { ScreenContainerFixed } from '@/components/ScreenContainerFixed'
import { COLORS, LAYOUT } from '@/constants/constants'
import { Link } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function WelcomePage() {
  return (
    <ScreenContainerFixed>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <AppText>
          BMverse has no affiliation, association, endorsement, or any
          connection to BABYMETAL, or any of its subsidiaries or affiliates.
          BMverse makes no claim to and has no ownership interest in any
          intellectual property owned by BABYMETAL or any of its affiliates.
        </AppText>
        <AppText>
          Album cover provided by Apple Music. Music preview provided courtesy
          of iTunes. Youtube Videos and thumbnail images are under the license
          terms of YouTube.
        </AppText>
        <Link
          href="https://bmverse.bruu.eu/privacy_and_terms"
          style={styles.linkText}
        >
          Read Privacy & Terms
        </Link>
      </ScrollView>
      <View style={{ marginVertical: 0 }}></View>
      <Link href="/login" asChild>
        <AppButton title="Accept" />
      </Link>
    </ScreenContainerFixed>
  )
}
// <Link ... replace|push asChild>

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
  linkText: {
    color: 'rgba(23, 126, 195, 1)',
    paddingLeft: 80,
    textDecorationLine: 'underline',
  },
})

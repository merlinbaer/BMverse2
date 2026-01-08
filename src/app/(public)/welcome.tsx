import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { ScreenContainerFixed } from '@/components/ScreenContainerFixed'
import { COLORS, LAYOUT } from '@/constants/constants'
import termsText from '@/constants/terms'
import { Link } from 'expo-router'
import { ScrollView, StyleSheet } from 'react-native'
import Markdown from 'react-native-markdown-display'

export default function WelcomePage() {
  return (
    <ScreenContainerFixed>
      <AppText>Please read the Terms and Conditions:</AppText>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Markdown>{termsText}</Markdown>
      </ScrollView>
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
})

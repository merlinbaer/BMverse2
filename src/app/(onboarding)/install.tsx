import { router } from 'expo-router'
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { isInstallDismissed$, localStore$ } from '@/services/legend'

export default function InstallScreen() {
  const userAgent =
    typeof window !== 'undefined' ? window.navigator.userAgent : ''
  const isIOS = /iPhone|iPad|iPod/.test(userAgent)
  const isAndroid = /Android/.test(userAgent)
  const isMobile = isIOS || isAndroid
  const isDesktop = !isMobile && Platform.OS === 'web'

  const handleContinue = () => {
    isInstallDismissed$.set(true)
    const nextRoute = localStore$.isOnboarding.get()
      ? '/(onboarding)/welcome'
      : '/(main)/(tabs)/news/News'
    router.replace(nextRoute)
  }

  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image source={require('@/../assets/icon.png')} style={styles.logo} />
        </View>

        <AppText fontSize={FONT.SIZE.LG} style={styles.title}>
          {isDesktop ? 'Mobile Recommended' : 'Install BMverse'}
        </AppText>

        <AppText fontSize={FONT.SIZE.BASE} style={styles.description}>
          {isDesktop
            ? 'This app is designed specifically for mobile devices to provide the best experience.'
            : 'To enjoy the full offline experience and remove the browser bars, please install this app to your home screen.'}
        </AppText>

        <View style={styles.instructionsBox}>
          {!isDesktop && (
            <AppText fontSize={FONT.SIZE.LG} style={styles.instructionTitle}>
              How to install:
            </AppText>
          )}

          {isDesktop ? (
            <AppText fontSize={FONT.SIZE.SM} style={styles.steps}>
              For the intended experience, please open{' '}
              <AppText style={{ fontWeight: 'bold' }}>
                {window.location.origin}
              </AppText>{' '}
              on your iPhone or Android device and install it as a Web App.
            </AppText>
          ) : (
            // Mobile view (Standard instructions)
            <>
              {isIOS ? (
                <View style={styles.stepRow}>
                  <AppText fontSize={FONT.SIZE.SM} style={styles.steps}>
                    1. Tap the{' '}
                    <IMAGES.vector.MaterialIcons
                      name="ios-share"
                      size={20}
                      color={COLORS.TEXT}
                    />{' '}
                    button in the browser bar.
                  </AppText>
                  <AppText fontSize={FONT.SIZE.SM} style={styles.steps}>
                    2. Scroll down and select{' '}
                    <AppText style={{ fontWeight: 'bold' }}>
                      `Add to Home Screen`
                    </AppText>
                    .
                  </AppText>
                  <AppText fontSize={FONT.SIZE.SM} style={styles.steps}>
                    3. Launch from your home screen!
                  </AppText>
                </View>
              ) : (
                // isAndroid
                <View style={styles.stepRow}>
                  <AppText fontSize={FONT.SIZE.SM} style={styles.steps}>
                    1. Tap the{' '}
                    <Text style={{ verticalAlign: 'middle' }}>
                      <IMAGES.vector.MaterialIcons
                        name="more-vert"
                        size={20}
                        color={COLORS.TEXT}
                      />
                    </Text>{' '}
                    icon in the browser bar.
                  </AppText>
                  <AppText fontSize={FONT.SIZE.SM} style={styles.steps}>
                    2. Select{' '}
                    <AppText style={{ fontWeight: 'bold' }}>
                      `Install App`
                    </AppText>{' '}
                    or{' '}
                    <AppText style={{ fontWeight: 'bold' }}>
                      `Add to Home Screen`
                    </AppText>
                    .
                  </AppText>
                  <AppText fontSize={FONT.SIZE.SM} style={styles.steps}>
                    3. Launch from your home screen!
                  </AppText>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.7}
            style={styles.continueButton}
          >
            <AppText fontSize={FONT.SIZE.SM} style={styles.continueText}>
              {isDesktop ? 'Continue anyway' : 'Continue in browser'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    gap: 24,
    justifyContent: 'center',
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  continueButton: {
    padding: 12,
  },
  continueText: {
    color: COLORS.TEXT_MUTED,
    opacity: 0.8,
    textDecorationLine: 'underline',
  },
  description: {
    color: COLORS.TEXT,
    opacity: 0.8,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: -20,
    marginTop: 20,
  },
  instructionTitle: {
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  instructionsBox: {
    backgroundColor: COLORS.BG_GREY,
    borderColor: COLORS.MODAL_BORDER,
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
  },
  logo: {
    borderRadius: 24,
    height: 140,
    width: 140,
  },
  stepRow: {
    gap: 8,
  },
  steps: {
    color: COLORS.TEXT_MUTED,
    lineHeight: 24,
  },
  title: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

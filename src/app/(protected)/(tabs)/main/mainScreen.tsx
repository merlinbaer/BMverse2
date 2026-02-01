import { Href, useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Markdown from 'react-native-markdown-display'

import { COLORS, FONT, LAYOUT } from '@/constants/constants'

export default function MainScreen() {
  const router = useRouter()
  const [visibleCharacter, setVisibleCharacter] = useState<string | null>(null)

  // Resets the bubbles whenever the screen is focused (returned to or tab switched)
  useFocusEffect(
    useCallback(() => {
      return () => setVisibleCharacter(null)
    }, []),
  )

  const suMessage = 'Do you want to know more about our **Songs**?' // CR \n&nbsp;
  const moaMessage = 'Do you want to see us **dance**?'
  const momoMessage = 'Do you want to know more about our **Concerts**?'

  const handlePressCharacter = (name: string, screen: Href) => {
    if (visibleCharacter === name) {
      // If the bubble is already shown, navigate
      handlePressTextbox(screen)
    } else {
      // Otherwise, show the bubble
      setVisibleCharacter(name)
    }
  }
  const handlePressTextbox = (screen: Href) => {
    router.push(screen)
  }

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      {/* Background Pressable to close open messages */}
      <Pressable
        style={styles.backgroundCapture}
        onPress={() => setVisibleCharacter(null)}
      >
        <View style={styles.characterContainer}>
          {/* Su- at the top center */}
          <View style={styles.suAreaContainer}>
            <Pressable
              onPress={() =>
                handlePressCharacter(
                  'Su-',
                  '/(protected)/(tabs)/main/songs/Songs',
                )
              }
              style={styles.suImageTouchTarget}
            >
              <Image
                source={require('@/../assets/images/Su-.png')}
                style={styles.suImage}
                resizeMode="contain"
              />
            </Pressable>

            {visibleCharacter === 'Su-' && (
              <Pressable
                style={[styles.itemContainer, styles.suBubbleAbsolute]}
                onPress={() =>
                  handlePressTextbox('/(protected)/(tabs)/main/songs/Songs')
                }
              >
                <Markdown style={markdownStyles}>{suMessage}</Markdown>
              </Pressable>
            )}
          </View>

          {/* Momo and Moa in a row underneath */}
          <View style={styles.rowContainer}>
            <View style={[styles.sideCharacterWrapper, styles.momoWrapper]}>
              <Pressable
                onPress={() =>
                  handlePressCharacter(
                    'Momo',
                    '/(protected)/(tabs)/main/concerts/Concerts',
                  )
                }
              >
                <Image
                  source={require('@/../assets/images/Momo.png')}
                  style={styles.sideImage}
                  resizeMode="contain"
                />
              </Pressable>
              {visibleCharacter === 'Momo' && (
                <Pressable
                  style={[styles.itemContainer, styles.momoBubble]}
                  onPress={() =>
                    handlePressTextbox(
                      '/(protected)/(tabs)/main/concerts/Concerts',
                    )
                  }
                >
                  <Markdown style={markdownStyles}>{momoMessage}</Markdown>
                </Pressable>
              )}
            </View>

            <View style={[styles.sideCharacterWrapper, styles.moaWrapper]}>
              <Pressable
                onPress={() =>
                  handlePressCharacter(
                    'Moa',
                    '/(protected)/(tabs)/main/videos/Videos',
                  )
                }
              >
                <Image
                  source={require('@/../assets/images/Moa.png')}
                  style={styles.sideImage}
                  resizeMode="contain"
                />
              </Pressable>
              {visibleCharacter === 'Moa' && (
                <Pressable
                  style={[styles.itemContainer, styles.moaBubble]}
                  onPress={() =>
                    handlePressTextbox('/(protected)/(tabs)/main/videos/Videos')
                  }
                >
                  {/* eslint-disable-next-line react-native/no-raw-text */}
                  <Markdown style={markdownStyles}>{moaMessage}</Markdown>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </KeyboardAwareScrollView>
  )
}

const markdownStyles = {
  body: {
    fontSize: FONT.SIZE.SM,
    color: COLORS.TEXT,
    fontWeight: '400' as const,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
    flexWrap: 'wrap' as const,
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'flex-start' as const,
  },
  link: {
    color: '#34b7f1',
    textDecorationLine: 'underline' as const,
  },
  strong: {
    fontWeight: 'bold' as const,
  },
  em: {
    fontStyle: 'italic' as const,
  },
}

const styles = StyleSheet.create({
  backgroundCapture: {
    flex: 1,
    width: '100%',
  },
  characterContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  itemContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.MESSAGE_BUBBLE,
    borderRadius: 12,
    borderTopLeftRadius: 2,
    elevation: 1,
    marginBottom: 40,
    maxWidth: '120%', // Allows it to overflow
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: COLORS.BACKGROUND,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
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
  moaBubble: {
    alignSelf: 'flex-end',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 2,
    marginTop: 10,
    width: '150%', // Allows it to overflow
  },
  moaWrapper: {
    alignItems: 'flex-end',
  },
  momoBubble: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 2,
    marginTop: 10,
    width: '150%', // Allows it to overflow
  },
  momoWrapper: {
    alignItems: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 0,
    width: '100%',
  },
  sideCharacterWrapper: {
    flex: 1,
    overflow: 'visible',
  },
  sideImage: {
    height: 120,
    width: 120,
  },
  suAreaContainer: {
    alignItems: 'center',
    height: 220, // Reserves space for bubble
    width: '100%',
    zIndex: 10,
  },
  suBubbleAbsolute: {
    borderTopLeftRadius: 12,
    maxWidth: '90%',
    position: 'absolute',
    top: 150,
    zIndex: 11,
  },
  suImage: {
    height: 140,
    width: 140,
  },
  suImageTouchTarget: {
    height: 140,
    width: 140,
  },
})

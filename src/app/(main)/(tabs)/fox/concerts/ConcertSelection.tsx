import { Image } from 'expo-image'
import { Href, Stack, useRouter } from 'expo-router'
import React from 'react'
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppText } from '@/components/AppText'
import { MomoSpeaks } from '@/components/CharacterSpeaks'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'

export default function ConcertSelectionScreen() {
  const router = useRouter()
  const { width, height } = useWindowDimensions()

  const momoMessage = 'Show concerts by'

  const handleNavigate = (screen: Href) => {
    router.push(screen)
  }

  // Calculate maxButtonHeight dynamically based on screen height
  const interpolationPoint1 = { height: 852, buttonHeight: 200 }
  const interpolationPoint2 = { height: 956, buttonHeight: 240 }
  const seHeight = 667
  const seButtonHeight = 120

  let dynamicMaxButtonHeight: number
  if (height === seHeight) {
    dynamicMaxButtonHeight = seButtonHeight
  } else if (height >= interpolationPoint2.height) {
    dynamicMaxButtonHeight = interpolationPoint2.buttonHeight
  } else {
    // Linear interpolation (scales down below 852px)
    const ratio = height / interpolationPoint1.height
    dynamicMaxButtonHeight = interpolationPoint1.buttonHeight * ratio
  }

  // Calculate button dimensions
  const gridWidth = width - LAYOUT.paddingHorizontal * 2 - 16 // subtract padding and gap
  const buttonWidth = (gridWidth - 16) / 2 // 2 buttons per row, minus gap
  const calculatedHeight = (buttonWidth * 4) / 3 // 4:3 ratio (height:width)
  const buttonHeight = Math.min(calculatedHeight, dynamicMaxButtonHeight)

  const buttonConfigs = [
    {
      id: 'year',
      image: require('@/../assets/images/concert_box_year.png'),
      screen: '/(main)/(tabs)/fox/concerts/ConcertsYear' as Href,
      position: 'top-left',
      label: 'Year',
    },
    {
      id: 'country',
      image: require('@/../assets/images/concert_box_country.png'),
      screen: '/(main)/(tabs)/fox/concerts/ConcertsCountry' as Href,
      position: 'top-right',
      label: 'Country',
    },
    {
      id: 'tour',
      image: require('@/../assets/images/concert_box_tour.png'),
      screen: '/(main)/(tabs)/fox/concerts/ConcertsTour' as Href,
      position: 'bottom-left',
      label: 'Tour',
    },
    {
      id: 'upcoming',
      image: require('@/../assets/images/concert_box_upcoming.png'),
      screen: '/(main)/(tabs)/fox/concerts/Upcoming' as Href,
      position: 'bottom-right',
      label: 'Upcoming',
    },
  ]

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <Stack.Screen options={{ title: '' }} />
      <View style={styles.container}>
        <MomoSpeaks markup={momoMessage} />

        {/* Button Grid 2x2 - below Momo */}
        <View style={styles.gridContainer}>
          {/* Top row */}
          <View style={styles.row}>
            {buttonConfigs
              .filter(btn => btn.position.includes('top'))
              .map(btn => (
                <Pressable
                  key={btn.id}
                  style={[
                    styles.buttonWrapper,
                    { width: buttonWidth, height: buttonHeight },
                  ]}
                  onPress={() => handleNavigate(btn.screen)}
                >
                  <View style={styles.button}>
                    <Image
                      source={require('@/../assets/images/icon_background_blur.png')}
                      style={styles.blurBackground}
                      contentFit="cover"
                    />
                    <Image
                      source={btn.image}
                      style={styles.buttonImage}
                      contentFit="contain"
                    />
                    <AppText
                      style={{
                        marginTop: -10,
                        color: COLORS.TEXT_MUTED,
                        fontSize: FONT.SIZE.BASE,
                      }}
                    >
                      {' '}
                      {btn.label}{' '}
                    </AppText>
                  </View>
                </Pressable>
              ))}
          </View>

          {/* Bottom row */}
          <View style={styles.row}>
            {buttonConfigs
              .filter(btn => btn.position.includes('bottom'))
              .map(btn => (
                <Pressable
                  key={btn.id}
                  style={[
                    styles.buttonWrapper,
                    { width: buttonWidth, height: buttonHeight },
                  ]}
                  onPress={() => handleNavigate(btn.screen)}
                >
                  <View style={styles.button}>
                    <Image
                      source={require('@/../assets/images/icon_background_blur.png')}
                      style={styles.blurBackground}
                      contentFit="cover"
                    />
                    <Image
                      source={btn.image}
                      style={styles.buttonImage}
                      contentFit="contain"
                    />
                    <AppText
                      style={{
                        marginTop: -10,
                        color: COLORS.TEXT_MUTED,
                        fontSize: FONT.SIZE.BASE,
                      }}
                    >
                      {' '}
                      {btn.label}{' '}
                    </AppText>
                  </View>
                </Pressable>
              ))}
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    opacity: 0.8,
    width: '100%',
  },
  button: {
    alignItems: 'center',
    borderRadius: 20,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  buttonImage: {
    height: '80%',
    width: '80%',
  },
  buttonWrapper: {
    borderRadius: 20,
  },
  container: {
    alignItems: 'flex-start',
    width: '100%',
  },
  gridContainer: {
    gap: 20,
    marginTop: 25,
    width: '100%',
  },
  keyboardAwareContentContainer: {
    paddingBottom: 80,
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
  row: {
    flexDirection: 'row',
    gap: 20,
  },
})

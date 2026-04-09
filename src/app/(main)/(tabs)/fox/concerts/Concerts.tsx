import { Href, useRouter } from 'expo-router'
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Markdown from 'react-native-markdown-display'

import { COLORS, FONT, LAYOUT } from '@/constants/constants'

export default function ConcertsScreen() {
  const router = useRouter()
  const { width, height } = useWindowDimensions()

  const momoMessage = 'Show concerts by'

  const handleNavigate = (screen: Href) => {
    router.push(screen)
  }

  // Calculate maxButtonHeight dynamically based on screen height
  // Calculate maxButtonHeight dynamically based on screen height
  // Using interpolation: at height 852px -> buttonHeight 200px, at height 956px -> buttonHeight 240px
  // Exception: at height 667px (iPhone SE II/III) -> buttonHeight 120px
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
      screen: '/(main)/(tabs)/fox/concerts/year' as Href,
      position: 'top-left',
    },
    {
      id: 'country',
      image: require('@/../assets/images/concert_box_country.png'),
      screen: '/(main)/(tabs)/fox/concerts/country' as Href,
      position: 'top-right',
    },
    {
      id: 'tour',
      image: require('@/../assets/images/concert_box_tour.png'),
      screen: '/(main)/(tabs)/fox/concerts/tour' as Href,
      position: 'bottom-left',
    },
    {
      id: 'upcoming',
      image: require('@/../assets/images/concert_box_upcoming.png'),
      screen: '/(main)/(tabs)/fox/concerts/upcoming' as Href,
      position: 'bottom-right',
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
      <View style={styles.container}>
        {/* Left section: Momo image and text */}
        <View style={styles.leftSection}>
          <Image
            source={require('@/../assets/images/Momo.png')}
            style={styles.momoImage}
            resizeMode="contain"
          />
          <View style={styles.textBubble}>
            <Markdown style={markdownStyles}>{momoMessage}</Markdown>
          </View>
        </View>

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
                      source={btn.image}
                      style={styles.buttonImage}
                      resizeMode="contain"
                    />
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
                      source={btn.image}
                      style={styles.buttonImage}
                      resizeMode="contain"
                    />
                  </View>
                </Pressable>
              ))}
          </View>
        </View>
      </View>
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
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderRadius: 20,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  buttonImage: {
    height: '100%',
    width: '100%',
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
      ios: 160,
      android: 20,
      default: 10,
    }),
  },
  keyboardAwareScrollView: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  leftSection: {
    alignItems: 'center',
    gap: 12,
  },
  momoImage: {
    height: 80,
    width: 80,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  textBubble: {
    backgroundColor: COLORS.MESSAGE_BUBBLE,
    borderRadius: 12,
    borderTopLeftRadius: 2,
    elevation: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: COLORS.BACKGROUND,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
})

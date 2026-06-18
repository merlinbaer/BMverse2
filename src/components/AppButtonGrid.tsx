import { Image, ImageSource } from 'expo-image'
import { Href, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native'

import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'

export type GridButtonConfig = {
  id: string
  image: ImageSource
  screen: Href
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  label: string
}

type AppButtonGridProps = {
  buttonConfigs: GridButtonConfig[]
}

export function AppButtonGrid({ buttonConfigs }: AppButtonGridProps) {
  const router = useRouter()
  const { width, height } = useWindowDimensions()

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
    const ratio = height / interpolationPoint1.height
    dynamicMaxButtonHeight = interpolationPoint1.buttonHeight * ratio
  }

  const gridWidth = width - LAYOUT.paddingHorizontal * 2 - 16
  const buttonWidth = (gridWidth - 16) / 2
  const calculatedHeight = (buttonWidth * 4) / 3
  const buttonHeight = Math.min(calculatedHeight, dynamicMaxButtonHeight)

  const renderButton = (btn: GridButtonConfig) => (
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
          source={IMAGES.other.background}
          style={styles.blurBackground}
          contentFit="cover"
        />
        <Image
          source={btn.image}
          style={styles.buttonImage}
          contentFit="contain"
        />
        <AppText style={styles.buttonLabel}>{btn.label}</AppText>
      </View>
    </Pressable>
  )

  return (
    <View style={styles.gridContainer}>
      <View style={styles.row}>
        {buttonConfigs
          .filter(btn => btn.position.includes('top'))
          .map(renderButton)}
      </View>
      <View style={styles.row}>
        {buttonConfigs
          .filter(btn => btn.position.includes('bottom'))
          .map(renderButton)}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  blurBackground: {
    ...StyleSheet.absoluteFill,
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
  buttonLabel: {
    color: COLORS.TEXT_MUTED,
    fontSize: FONT.SIZE.BASE,
    marginTop: -10,
  },
  buttonWrapper: {
    borderRadius: 20,
  },
  gridContainer: {
    gap: 20,
    marginTop: 25,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
})

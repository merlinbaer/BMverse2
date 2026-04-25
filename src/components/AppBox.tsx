import React, { ReactNode } from 'react'
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native'

import { COLORS } from '@/constants/constants'

interface AppBoxProps {
  children: ReactNode
  style?: ViewStyle
}

export function AppBox({ children, style }: AppBoxProps) {
  return (
    <View style={[styles.container, style]}>
      {/* The Red Line on the left */}
      <View style={styles.redLine} />

      <ImageBackground
        source={require('@/../assets/images/icon_background_blur.png')}
        style={styles.imageBackground}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>{children}</View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%', // Fix for Web: ensures image fills the vertical space
    opacity: 0.5,
    width: '100%', // Fix for Web: ensures image fills the horizontal space
  },
  container: {
    borderRadius: 8,
    flexDirection: 'row',
    marginVertical: 10,
    overflow: 'hidden', // Ensures background and red line respect border radius
    width: '100%',
  },
  contentContainer: {
    gap: 8,
    padding: 16,
  },
  imageBackground: {
    backgroundColor: COLORS.BG_GREY, // Fallback background color
    flex: 1,
  },
  redLine: {
    backgroundColor: COLORS.PRIMARY, // Assumes red is your primary color
    width: 4,
  },
})

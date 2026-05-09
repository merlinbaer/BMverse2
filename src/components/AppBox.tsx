import { Image } from 'expo-image'
import React, { ReactNode } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { COLORS } from '@/constants/constants'

interface AppBoxProps {
  children: ReactNode
  style?: ViewStyle
}

export function AppBox({ children, style }: AppBoxProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('@/../assets/images/icon_background_blur.png')}
        style={styles.blurBackground}
        contentFit="cover"
      />
      <View style={styles.contentContainer}>
        <View style={styles.redLine} />
        <View style={styles.textWrapper}>{children}</View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  blurBackground: {
    bottom: 0,
    left: 0,
    opacity: 0.8,
    position: 'absolute',
    right: 0,
    top: 0, // This only affects the image now
  },
  container: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    flexDirection: 'row',
    marginVertical: 8,
    overflow: 'hidden',
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  redLine: {
    backgroundColor: COLORS.PRIMARY,
    opacity: 1,
    width: 4,
  },
  textWrapper: {
    flex: 1,
    gap: 4,
    padding: 16,
  },
})

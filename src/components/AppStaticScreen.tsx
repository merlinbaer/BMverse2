import React, { ReactNode } from 'react'
import { Platform, StyleSheet, View, ViewStyle } from 'react-native'

import { COLORS, LAYOUT } from '@/constants/constants'

interface AppStaticScreenProps {
  children: ReactNode
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
}

export function AppStaticScreen({
  children,
  style,
  contentContainerStyle,
}: AppStaticScreenProps) {
  return (
    <View style={[styles.screen, style]}>
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {children}
      </View>
      <View style={styles.bottomSpacer} />
    </View>
  )
}

const styles = StyleSheet.create({
  bottomSpacer: {
    height: Platform.select({
      ios: 80,
      android: 70,
      default: 70,
    }),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 160,
      android: 10,
      default: 0,
    }),
  },
  screen: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
})

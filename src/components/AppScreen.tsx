import React, { ReactNode } from 'react'
import { Platform, StyleSheet, View, ViewStyle } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { COLORS, LAYOUT } from '@/constants/constants'

interface AppScreenProps {
  children: ReactNode
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
}

export function AppScreen({
  children,
  style,
  contentContainerStyle,
}: AppScreenProps) {
  return (
    <KeyboardAwareScrollView
      style={[styles.screen, style]}
      contentContainerStyle={[
        styles.keyboardAwareContentContainer,
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      {children}
      <View style={styles.bottomSpacer} />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  bottomSpacer: {
    height: Platform.select({
      ios: 100,
      android: 100,
      default: 90,
    }),
  },
  keyboardAwareContentContainer: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 160, // Adjust this based on your header needs
      android: 10,
      default: 0,
    }),
  },
  screen: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
})

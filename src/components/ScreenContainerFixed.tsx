import { COLORS, LAYOUT } from '@/constants/constants'
import { ReactNode } from 'react'
import { Platform, StatusBar, StyleSheet, View, ViewStyle } from 'react-native'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'

type ScreenContainerFixedProps = {
  children: ReactNode
  style?: ViewStyle
  safeAreaProps?: SafeAreaViewProps
  statusBarHidden?: boolean
}

export function ScreenContainerFixed({
  children,
  style,
  safeAreaProps,
  statusBarHidden = false,
}: ScreenContainerFixedProps) {
  const statusBarStyle = 'light-content'
  if (!statusBarHidden) {
    StatusBar.setBarStyle(statusBarStyle, true)
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(styles.safeArea.backgroundColor, true)
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, style]} {...safeAreaProps}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 100,
      android: 0,
      web: 10,
      default: 0,
    }),
    paddingBottom: 24,
    gap: LAYOUT.gap, // funktioniert nur bei React Native 0.71+ oder Web, sonst ggf. marginBottom
  },
})

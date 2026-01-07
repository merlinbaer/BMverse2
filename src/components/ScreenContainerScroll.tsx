import { COLORS, LAYOUT } from '@/constants/constants'
import { ReactNode } from 'react'
import {
  Platform,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'

type ScreenContainerScrollProps = {
  children: ReactNode
  style?: ViewStyle
  safeAreaProps?: SafeAreaViewProps
  scrollProps?: ScrollViewProps
  statusBarHidden?: boolean
}

export function ScreenContainerScroll({
  children,
  style,
  safeAreaProps,
  scrollProps,
  statusBarHidden = false,
}: ScreenContainerScrollProps) {
  const statusBarStyle = 'light-content'
  if (!statusBarHidden) {
    StatusBar.setBarStyle(statusBarStyle, true)
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(styles.safeArea.backgroundColor, true)
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, style]} {...safeAreaProps}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        automaticallyAdjustsScrollIndicatorInsets
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        {...scrollProps}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    gap: LAYOUT.gap,
    paddingTop: Platform.select({
      ios: 12,
      android: 0,
      web: 10,
      default: 0,
    }),
    paddingBottom: 24,
  },
})

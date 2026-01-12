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
  /**
   * Set to true if you are using a FlatList or SectionList as a child.
   * This will disable the internal ScrollView wrapper to avoid nested scrolling issues.
   */
  isList?: boolean
}

export function ScreenContainerScroll({
  children,
  style,
  safeAreaProps,
  scrollProps,
  statusBarHidden = false,
  isList = false,
}: ScreenContainerScrollProps) {
  if (!statusBarHidden) {
    StatusBar.setBarStyle('light-content', true)
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(COLORS.BACKGROUND, true)
    }
  }

  // For iOS with large headers (headerTransparent: true), we want the scroll view
  // to extend to the top of the screen. contentInsetAdjustmentBehavior="automatic"
  // will handle the padding correctly.
  const edges = Platform.OS === 'ios' ? ['left', 'right', 'bottom'] : undefined

  if (isList) {
    return (
      <SafeAreaView
        style={[styles.safeArea, style]}
        edges={edges as any}
        {...safeAreaProps}
      >
        {children}
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, style]}
      edges={edges as any}
      {...safeAreaProps}
    >
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
      ios: 0, // Adjusted for large headers
      android: 0,
      web: 10,
      default: 0,
    }),
    paddingBottom: 24,
  },
})

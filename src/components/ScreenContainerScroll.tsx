import { COLORS, LAYOUT } from '@/constants/constants'
import { ReactNode, useEffect } from 'react'
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
  useEffect(() => {
    if (!statusBarHidden) {
      StatusBar.setBarStyle('light-content', true)
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(COLORS.BACKGROUND, true)
      }
    }
  }, [statusBarHidden])

  // For iOS with large headers (headerTransparent: true), we want the scroll view
  // to extend to the top of the screen. contentInsetAdjustmentBehavior="automatic"
  // will handle the padding correctly.
  // Using SafeAreaView on iOS can sometimes prevent the large title from appearing.
  const isIOS = Platform.OS === 'ios'
  const edges = isIOS ? ['left', 'right', 'bottom'] : undefined

  if (isList) {
    if (isIOS) {
      // Return children directly to allow the scrollable component (FlatList/SectionList)
      // to be the root of the screen, which is required for iOS native large title transitions.
      // Note: background color and flex should be applied to the child component.
      return children as any
    }
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

  if (isIOS) {
    return (
      <ScrollView
        style={[styles.scrollView, style]}
        contentContainerStyle={styles.scrollContent}
        automaticallyAdjustsScrollIndicatorInsets
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        scrollEventThrottle={16}
        {...scrollProps}
      >
        {children}
      </ScrollView>
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
        scrollEventThrottle={16}
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
    backgroundColor: COLORS.BACKGROUND,
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

import { COLORS } from '@/constants/constants'
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

type ScreenContainerProps = {
  children: ReactNode
  style?: ViewStyle
  safeAreaProps?: SafeAreaViewProps
  scrollProps?: ScrollViewProps
  statusBarHidden?: boolean
}

export function ScreenContainer({
  children,
  style,
  safeAreaProps,
  scrollProps,
  statusBarHidden = false,
}: ScreenContainerProps) {
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
    paddingHorizontal: 16,
  },
})

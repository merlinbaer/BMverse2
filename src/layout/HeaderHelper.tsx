import { FontAwesome } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Href, router } from 'expo-router'
import React from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'

const androidHeaderTopPadding = 8

export const AndroidHeaderTitle = ({ children }: { children: string }) => {
  if (Platform.OS !== 'android') return <>{children}</>
  const topPadding =
    (StatusBar.currentHeight ?? 0) + (androidHeaderTopPadding - 8)
  return (
    <View
      style={{
        paddingTop: topPadding,
      }}
    >
      <AppText fontSize={FONT.SIZE.LG + 12}>{children}</AppText>
    </View>
  )
}

export const LayoutScreenHeader: NativeStackNavigationOptions =
  Platform.select<NativeStackNavigationOptions>({
    ios: {
      headerLargeTitle: true,
      headerTransparent: true,
      headerBlurEffect: !isLiquidGlassAvailable() ? 'dark' : 'none',
      headerLargeStyle: !isLiquidGlassAvailable()
        ? { backgroundColor: COLORS.BACKGROUND }
        : {},
      headerBackButtonDisplayMode: 'minimal',
      headerLargeTitleStyle: {
        color: COLORS.TEXT,
      },
      headerTitleStyle: {
        color: COLORS.TEXT,
      },
      headerTintColor: COLORS.TEXT,
    },
    android: {
      headerStyle: { backgroundColor: COLORS.BACKGROUND },
      headerTitle: (props: { children: string }) => (
        <AndroidHeaderTitle {...props} />
      ),
      headerTintColor: COLORS.TEXT,
      headerShadowVisible: false,
    },
    web: {
      headerStyle: { backgroundColor: COLORS.BACKGROUND, height: 80 },
      headerTitleStyle: {
        fontSize: FONT.SIZE.LG + 12,
        color: COLORS.TEXT,
      },
      headerTintColor: COLORS.TEXT,
      headerShadowVisible: false,
      WelcomeContentStyle: { backgroundColor: COLORS.BACKGROUND },
    },
    default: {
      headerStyle: { backgroundColor: COLORS.BACKGROUND },
      headerTintColor: COLORS.TEXT,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: COLORS.BACKGROUND },
    },
  })

export const BackButton = () => (
  <TouchableOpacity onPress={() => router.back()}>
    <View style={headerStyles.backButton}>
      <FontAwesome name="chevron-left" size={24} color="white" />
    </View>
  </TouchableOpacity>
)

export const SortButton = ({ targetRoute }: { targetRoute: Href }) => (
  <TouchableOpacity onPress={() => router.push(targetRoute)}>
    <View style={headerStyles.sortButton}>
      <MaterialIcons name="sort" size={24} color="white" />
    </View>
  </TouchableOpacity>
)

export const headerStyles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  backButton: {
    paddingBottom: 2,
    paddingLeft: Platform.select({
      web: 12,
      default: 0,
    }),
    paddingRight: 12,
    paddingTop: Platform.select({
      android: (StatusBar.currentHeight ?? 0) + androidHeaderTopPadding,
      default: 8,
    }),
  },
  // eslint-disable-next-line react-native/no-unused-styles
  sortButton: {
    paddingBottom: 2,
    paddingRight: Platform.select({
      ios: 2,
      android: 4,
      web: 36,
    }),
    paddingTop: Platform.select({
      ios: 2,
      android: (StatusBar.currentHeight ?? 0) + androidHeaderTopPadding,
      default: 2,
    }),
  },
})

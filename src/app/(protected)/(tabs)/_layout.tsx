import { COLORS, TAB_BAR } from '@/constants/constants'
import { useBetterSafeAreaInsets } from '@/hooks/useBetterSafeAreaInsets'
import Octicons from '@expo/vector-icons/Octicons'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Platform, StyleSheet, View } from 'react-native'

export default function TabsLayout() {
  const insets = useBetterSafeAreaInsets()
  return (
    <React.Fragment>
      <Tabs
        initialRouteName="news"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            height: TAB_BAR.HEIGHT + insets.bottom, // Höhe variiert nach Devices
            borderTopLeftRadius: insets.corner, // Ecken varieren nach Devices
            borderTopRightRadius: insets.corner, // Ecken varieren nach Devices
            borderTopWidth: 0, // muss 0 sein
          },
          tabBarActiveTintColor: COLORS.BM_RED, // aktive Labelfarbe
          tabBarInactiveTintColor: COLORS.TEXT_MUTED, // inaktive Labelfarbe
          tabBarBackground: () =>
            Platform.OS !== 'android' ? (
              <BlurView
                intensity={TAB_BAR.BLUR_INTENSITY}
                tint="dark" // "light", "dark" oder "default"
                style={{
                  ...StyleSheet.absoluteFillObject,
                  overflow: 'hidden',
                  borderTopLeftRadius: insets.corner, // Ecken varieren nach Devices
                  borderTopRightRadius: insets.corner, // Ecken varieren nach Devices
                }}
              />
            ) : (
              // Fallback Android
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: COLORS.BACKGROUND,
                    overflow: 'hidden',
                    borderTopLeftRadius: insets.corner, // Ecken varieren nach Devices
                    borderTopRightRadius: insets.corner, // Ecken varieren nach Devices
                  },
                ]}
              />
            ),
        }}
      >
        <Tabs.Screen
          name="news"
          options={{
            title: 'News',
            tabBarIconStyle: { marginTop: TAB_BAR.ICON_MARGIN_TOP },
            tabBarIcon: ({ color }: BottomTabBarProps) => (
              <Octicons name="home" size={TAB_BAR.ICON_SIZE} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="main"
          options={{
            title: 'Main',
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Image
                source={
                  focused
                    ? require('@/../assets/tabicons/main.png')
                    : require('@/../assets/tabicons/mainGrey.png')
                }
                style={{
                  width: TAB_BAR.ICON_IMAGE_SIZE,
                  height: TAB_BAR.ICON_IMAGE_SIZE,
                  bottom: TAB_BAR.ICON_IMAGE_POSY,
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIconStyle: { marginTop: TAB_BAR.ICON_MARGIN_TOP },
            tabBarIcon: ({ color }: BottomTabBarProps) => (
              <Octicons name="person" size={TAB_BAR.ICON_SIZE} color={color} />
            ),
          }}
        />
      </Tabs>
    </React.Fragment>
  )
}

import Octicons from '@expo/vector-icons/Octicons'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Platform, StyleSheet, View } from 'react-native'

import { COLORS, TAB_BAR } from '@/constants/constants'
import { useBetterSafeAreaInsets } from '@/hooks/useBetterSafeAreaInsets'

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
            height: TAB_BAR.HEIGHT + insets.bottom, // Height varies by device
            borderTopLeftRadius: insets.corner, // Corners vary by device
            borderTopRightRadius: insets.corner, // Corners vary by device
            borderTopWidth: 0, // must be 0
          },
          tabBarActiveTintColor: COLORS.BM_RED, // active label color
          tabBarInactiveTintColor: COLORS.TEXT_MUTED, // inactive label color
          tabBarBackground: () =>
            Platform.OS !== 'android' ? (
              <BlurView
                intensity={TAB_BAR.BLUR_INTENSITY}
                tint="dark" // "light", "dark" or "default"
                style={{
                  ...StyleSheet.absoluteFillObject,
                  overflow: 'hidden',
                  borderTopLeftRadius: insets.corner, // Corners vary by device
                  borderTopRightRadius: insets.corner, // Corners vary by device
                }}
              />
            ) : (
              // Android Fallback
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: COLORS.BACKGROUND,
                    overflow: 'hidden',
                    borderTopLeftRadius: insets.corner, // Corners vary by device
                    borderTopRightRadius: insets.corner, // Corners vary by device
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
            tabBarIcon: ({ color }: { color: string }) => (
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
            tabBarIcon: ({ color }: { color: string }) => (
              <Octicons name="person" size={TAB_BAR.ICON_SIZE} color={color} />
            ),
          }}
        />
      </Tabs>
    </React.Fragment>
  )
}

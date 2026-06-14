import Octicons from '@react-native-vector-icons/octicons'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { Tabs } from 'expo-router'
import React from 'react'
import { ColorValue, Platform, View } from 'react-native'

import { COLORS, TAB_BAR } from '@/constants/constants'
import { useBetterSafeAreaInsets } from '@/hooks/useBetterSafeAreaInsets'

export default function TabsLayout() {
  const insets = useBetterSafeAreaInsets()
  return (
    <React.Fragment>
      <Tabs
        initialRouteName="news"
        screenOptions={{
          sceneStyle: { backgroundColor: COLORS.BACKGROUND },
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
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  overflow: 'hidden',
                  borderTopLeftRadius: insets.corner, // Corners vary by device
                  borderTopRightRadius: insets.corner, // Corners vary by device
                }}
              />
            ) : (
              // Android Fallback
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: COLORS.BACKGROUND,
                  overflow: 'hidden',
                  borderTopLeftRadius: insets.corner, // Corners vary by device
                  borderTopRightRadius: insets.corner, // Corners vary by device
                }}
              />
            ),
        }}
      >
        <Tabs.Screen
          name="news"
          options={{
            title: 'News',
            tabBarIconStyle: { marginTop: TAB_BAR.ICON_MARGIN_TOP },
            tabBarIcon: ({ color }: { color: ColorValue }) => (
              <Octicons name="home" size={TAB_BAR.ICON_SIZE} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="player"
          options={{
            title: 'Player',
            tabBarIconStyle: { marginTop: TAB_BAR.ICON_MARGIN_TOP },
            tabBarIcon: ({ color }: { color: ColorValue }) => (
              <Octicons name="play" size={TAB_BAR.ICON_SIZE} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="fox"
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
                contentFit="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="games"
          options={{
            title: 'Games',
            tabBarIconStyle: { marginTop: TAB_BAR.ICON_MARGIN_TOP },
            tabBarIcon: ({ color }: { color: ColorValue }) => (
              <Octicons name="rocket" size={TAB_BAR.ICON_SIZE} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIconStyle: { marginTop: TAB_BAR.ICON_MARGIN_TOP },
            tabBarIcon: ({ color }: { color: ColorValue }) => (
              <Octicons name="person" size={TAB_BAR.ICON_SIZE} color={color} />
            ),
          }}
        />
      </Tabs>
    </React.Fragment>
  )
}

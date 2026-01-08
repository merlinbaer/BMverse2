import { COLORS, FONT, TAB_BAR } from '@/constants/constants'
import { useBetterSafeAreaInsets } from '@/hooks/useBetterSafeAreaInsets'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Platform, StyleSheet, View } from 'react-native'

export default function TabsLayout() {
  const insets = useBetterSafeAreaInsets()
  return (
    <React.Fragment>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            height: TAB_BAR.HEIGHT + insets.bottom, // Höhe variiert nach Devices
            borderTopLeftRadius: insets.corner, // Ecken varieren nach Devices
            borderTopRightRadius: insets.corner, // Ecken varieren nach Devices
            borderTopWidth: 0, // muss 0 sein
          },
          tabBarLabelStyle: {
            bottom: TAB_BAR.LABEL_POSY,
            fontSize: FONT.SIZE.XS,
            fontWeight: '500',
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
              // Fallback für Android/Web
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
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Image
                source={
                  focused
                    ? require('@/../assets/tabicons/Momo.png')
                    : require('@/../assets/tabicons/MomoGrey.png')
                }
                style={{
                  width: TAB_BAR.ICON_SIZE,
                  height: TAB_BAR.ICON_SIZE,
                  bottom: TAB_BAR.ICON_POSY,
                }}
                resizeMode="contain"
              />
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
                    ? require('@/../assets/tabicons/Su-.png')
                    : require('@/../assets/tabicons/Su-Grey.png')
                }
                style={{
                  width: TAB_BAR.ICON_SIZE,
                  height: TAB_BAR.ICON_SIZE,
                  bottom: TAB_BAR.ICON_POSY,
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
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Image
                source={
                  focused
                    ? require('@/../assets/tabicons/Moa.png')
                    : require('@/../assets/tabicons/MoaGrey.png')
                }
                style={{
                  width: TAB_BAR.ICON_SIZE,
                  height: TAB_BAR.ICON_SIZE,
                  bottom: TAB_BAR.ICON_POSY,
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
      </Tabs>
    </React.Fragment>
  )
}

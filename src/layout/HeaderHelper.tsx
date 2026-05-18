import React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'

import { AppText } from '@/components/AppText'
import { FONT } from '@/constants/constants'

export const AndroidHeaderTitle = ({ children }: { children: string }) => {
  if (Platform.OS !== 'android') return <>{children}</>

  return (
    <View style={{ paddingTop: StatusBar.currentHeight ?? 0 }}>
      <AppText fontSize={FONT.SIZE.LG + 12}>{children}</AppText>
    </View>
  )
}

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
      android: (StatusBar.currentHeight ?? 0) + 8,
      default: 8,
    }),
  },
})

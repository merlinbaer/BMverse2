import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'

import { COLORS } from '@/constants/constants'

interface AppBannerProps {
  title: string
}

export default function AppBanner({ title }: AppBannerProps) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[COLORS.BACKGROUND, COLORS.PRIMARY, COLORS.BACKGROUND]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View>
          <Text style={styles.text}>{title}</Text>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    borderColor: COLORS.BACKGROUND,
    borderRadius: 4,
    borderWidth: 2,
    elevation: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,

    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.4)',
      },
      default: {
        shadowColor: COLORS.BACKGROUND,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
    }),
    transform: [{ rotate: '-4deg' }],
  },
  text: {
    color: COLORS.TEXT,
    fontSize: 48,
    fontWeight: '900',
  },

  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'

type AppInfoRowProps = {
  label: string
  value: string
}

export function AppInfoRow({ label, value }: AppInfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
        {label}
      </AppText>
      <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
        {value}
      </AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  prompt: {
    color: COLORS.TEXT_MUTED,
  },
  value: {
    color: COLORS.SECONDARY,
  },
})

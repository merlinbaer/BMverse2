import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { AppMarkdown } from '@/components/AppMarkdown'
import { AppText } from '@/components/AppText'
import { COLORS } from '@/constants/constants'

interface AppBubbleTextProps {
  markup: string
  footer?: string | null
  orientation?: 'left' | 'right' | 'center'
}

export function AppBubbleText({
  markup,
  footer,
  orientation = 'left',
}: AppBubbleTextProps) {
  const containerStyle: ViewStyle = {
    alignSelf:
      orientation === 'center'
        ? 'center'
        : orientation === 'left'
          ? 'flex-start'
          : 'flex-end',
    borderTopLeftRadius: orientation === 'left' ? 2 : 12,
    borderTopRightRadius: orientation === 'right' ? 2 : 12,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  }

  return (
    <View style={[styles.itemContainer, containerStyle]}>
      <AppMarkdown markup={markup} />
      {footer ? (
        <View style={styles.footer}>
          <AppText style={styles.dateText}>{footer}</AppText>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  dateText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
  },
  footer: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  itemContainer: {
    backgroundColor: COLORS.MESSAGE_BUBBLE,
    borderRadius: 12,
    elevation: 1,
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: COLORS.BACKGROUND,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
})

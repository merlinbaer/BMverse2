import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Markdown from 'react-native-markdown-display'

import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'

interface AppMarkupProps {
  markup: string
  footer?: string | null
  orientation?: 'left' | 'right' | 'center'
}

export function AppMarkdown({
  markup,
  footer,
  orientation = 'left',
}: AppMarkupProps) {
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
      <Markdown style={markdownStyles}>{markup}</Markdown>
      {footer ? (
        <View style={styles.footer}>
          <AppText style={styles.dateText}>{footer}</AppText>
        </View>
      ) : null}
    </View>
  )
}

const markdownStyles = {
  body: {
    fontSize: FONT.SIZE.SM,
    color: COLORS.TEXT,
    fontWeight: 300 as const,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
    flexWrap: 'wrap' as const,
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'flex-start' as const,
  },
  link: {
    color: '#34b7f1',
    textDecorationLine: 'underline' as const,
  },
  strong: {
    fontWeight: 'bold' as const,
  },
  em: {
    fontStyle: 'italic' as const,
  },
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
    // Elevation for Android
    elevation: 1,
    // All
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    // Shadow for iOS
    shadowColor: COLORS.BACKGROUND,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
})

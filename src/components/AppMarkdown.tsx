import React from 'react'
import Markdown from 'react-native-markdown-display'

import { COLORS, FONT } from '@/constants/constants'

interface AppMarkupProps {
  markup: string
}

export function AppMarkdown({ markup }: AppMarkupProps) {
  return <Markdown style={markdownStyles}>{markup}</Markdown>
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

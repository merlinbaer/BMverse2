import { COLORS, FONT } from '@/constants/constants'
import { ReactNode } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

type AppTextProps = TextProps & {
  children: ReactNode
  fontSize?: number
}

export function AppText({ children, style, fontSize, ...props }: AppTextProps) {
  return (
    <Text style={[styles.text, fontSize ? { fontSize } : {}, style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.SM,
    fontWeight: FONT.WEIGHT.BASE,
  },
})

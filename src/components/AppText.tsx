import { COLORS, FONT } from '@/constants/constants'
import { ReactNode } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

type AppTextProps = TextProps & { children: ReactNode }

export function AppText({ children, style, ...props }: AppTextProps) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    color: COLORS.TEXT, // immer weiß
    fontSize: FONT.SIZE.SM,
    fontWeight: FONT.WEIGHT.BASE,
  },
})

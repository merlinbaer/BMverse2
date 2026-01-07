import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { StyleSheet, Text, View } from 'react-native'

type FixedLargeHeaderProps = {
  title: string
}

export function FixedLargeHeaderIos({ title }: FixedLargeHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 140,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'flex-end',
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  headerTitle: {
    fontSize: FONT.SIZE.LG + 12,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
})

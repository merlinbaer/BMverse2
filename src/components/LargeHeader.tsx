import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { StyleSheet, Text, View } from 'react-native'

/*  
// Use in _layout when Scrollview screen don't look nice after the return of a stacked view
      name="welcome"
        options={{
          header:
            Platform.OS === 'ios'
              ? () => <FixedLargeHeaderIos title="Welcome" />
              : undefined,
          ...LayoutScreenHeader,
          headerTitle: 'Welcome', */

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

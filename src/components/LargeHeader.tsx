import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { StyleSheet, Text, View } from 'react-native'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

// Use in _layout to simulate Large Header at ios without collapsing header
/*
      name="welcome"
        options={{
          header:
            Platform.OS === 'ios'
              ? () => <FixedLargeHeaderIos title="Welcome" />
              : undefined,
          ...LargeHeaderOptions,
          headerTitle: 'Welcome',
*/

export const LargeHeaderOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: COLORS.BACKGROUND, height: 80 },
  headerTitleStyle: {
    fontSize: FONT.SIZE.LG + 12,
    color: COLORS.TEXT,
  },
  headerTintColor: COLORS.TEXT,
  headerShadowVisible: false,
  headerTitleAlign: 'left',
}

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

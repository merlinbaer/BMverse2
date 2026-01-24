import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { StyleSheet, Text, View } from 'react-native'

import { COLORS, FONT, LAYOUT } from '@/constants/constants'

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
    backgroundColor: COLORS.BACKGROUND,
    height: 140,
    justifyContent: 'flex-end',
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  headerTitle: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.LG + 12,
    fontWeight: 'bold',
  },
})

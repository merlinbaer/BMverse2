import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { COLORS } from '@/constants/constants'

// eslint-disable-next-line no-empty-pattern
export default function LoadScreen({}) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
    justifyContent: 'center',
  },
})

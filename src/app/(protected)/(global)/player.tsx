import { StyleSheet, View } from 'react-native'

import { AppText } from '@/components/AppText'
import { COLORS } from '@/constants/constants'

export default function PlayerScreen() {
  return (
    <View style={styles.container}>
      <AppText>Player</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
})

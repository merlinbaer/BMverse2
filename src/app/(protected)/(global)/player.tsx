import { AppText } from '@/components/AppText'
import { StyleSheet, View } from 'react-native'
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
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
})

import { Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { AppBubbleText } from '@/components/AppBubbleText'
import { AppScreen } from '@/components/AppScreen'

export default function GamesScreen() {
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Games' }} />
      <View style={styles.container}>
        <AppBubbleText
          markup={'Only in IOS and Android when logged in'}
          orientation={'center'}
        />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
})

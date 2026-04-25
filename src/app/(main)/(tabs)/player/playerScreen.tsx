import { Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { AppMarkdown } from '@/components/AppMarkdown'
import { AppScreen } from '@/components/AppScreen'

export default function PlayerScreen() {
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Music Player' }} />
      <View style={styles.characterContainer}>
        <AppMarkdown
          markup={'Only in IOS and Android when logged in.'}
          orientation={'center'}
        />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  characterContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
})

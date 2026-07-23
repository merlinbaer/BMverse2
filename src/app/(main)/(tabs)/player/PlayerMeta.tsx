import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppScreen } from '@/components/AppScreen'

export default function PlayerMetaScreen() {
  const router = useRouter()

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Meta Main Selection' }} />
      <View style={styles.container}>
        <AppButton
          title="Select Music File"
          onPress={() => router.push('/(main)/(tabs)/player/PlayerMetaTracks')}
        />
        <AppButton
          title="Select from Album"
          onPress={() => router.push('/(main)/(tabs)/player/PlayerMetaAlbum')}
        />
        <AppButton
          title="Select from Playlist"
          onPress={() =>
            router.push('/(main)/(tabs)/player/PlayerMetaPlaylist')
          }
        />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 40,
    marginVertical: 60,
    width: '100%',
  },
})

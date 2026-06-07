import { Href, Stack } from 'expo-router'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { AppBubbleText } from '@/components/AppBubbleText'
import { AppButtonGrid, GridButtonConfig } from '@/components/AppButtonGrid'
import { AppScreen } from '@/components/AppScreen'

export default function PlayerScreen() {
  const isWeb = Platform.OS === 'web'

  const buttonConfigs: GridButtonConfig[] = [
    {
      id: 'load',
      image: require('@/../assets/images/player_box_load.png'),
      screen: '/player/PlayerLoad' as Href,
      position: 'top-left',
      label: 'Add Music',
    },
    {
      id: 'metadata',
      image: require('@/../assets/images/player_box_metadata.png'),
      screen: '/player/PlayerMetadata' as Href,
      position: 'top-right',
      label: 'Metadata',
    },
    {
      id: 'playlist',
      image: require('@/../assets/images/player_box_playlist.png'),
      screen: '/player/PlayerPlaylist' as Href,
      position: 'bottom-left',
      label: 'Playlists',
    },
    {
      id: 'play',
      image: require('@/../assets/images/player_box_play.png'),
      screen: '/player/PlayerPlay' as Href,
      position: 'bottom-right',
      label: 'Play',
    },
  ]

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Music Player' }} />
      <View style={styles.container}>
        {isWeb ? (
          <AppBubbleText
            markup={'Only in IOS and Android available.'}
            orientation={'center'}
          />
        ) : (
          <AppButtonGrid buttonConfigs={buttonConfigs} />
        )}
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

import { computed } from '@legendapp/state'
import { setAudioModeAsync } from 'expo-audio'

import { IMAGES } from '@/constants/images'
import { localMusicFiles$ } from '@/services/legend'
import { ListItemType } from '@/types/list'

// Configure global audio mode [[2]](https://docs.expo.dev/versions/latest/sdk/audio)
export const initAudioMode = () => {
  void setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'doNotMix',
  })
}

export const localMusicList$ = computed<ListItemType[]>(() => {
  const files = localMusicFiles$.get()
  if (!files) return []

  return files.map(
    (file): ListItemType => ({
      id: file.id,
      line1: file.title,
      line2: file.artist ?? 'Unknown',
      icon: IMAGES.cover200.single,
      route: null,
      value: file.audioUri,
    }),
  )
})

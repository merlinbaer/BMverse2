import { computed } from '@legendapp/state'
import { setAudioModeAsync } from 'expo-audio'

import coverSINGLE from '@/../assets/images/Single_200.png'
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
      line1: file.originalName,
      line2: 'Unknown',
      icon: coverSINGLE,
      route: null,
      value: file.uri,
    }),
  )
})

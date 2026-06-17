import { computed } from '@legendapp/state'
import { Href } from 'expo-router'

import { IMAGES } from '@/constants/images'
import { ListItemType, SongListType } from '@/types/list'
import { PreviewSong } from '@/types/player'
import { SongType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, item$, sync, clearCache } = createTableStore<SongType>({
  collection: 'bm_songs',
  actions: ['read'],
  sort: (a, b) => a.song_id.localeCompare(b.song_id),
})

// Add Factory functions
export const songs$ = store$
export const songItem$ = item$
export const songSync = sync
export const songClearCache = clearCache

// Domain-specific functions
const getSongCover = (coverName: string | null) => {
  switch (coverName) {
    case 'BABYMETAL':
      return IMAGES.cover200.babymetal
    case 'METAL RESISTANCE':
      return IMAGES.cover200.metalResistance
    case 'METAL GALAXY':
      return IMAGES.cover200.metalGalaxy
    case 'THE OTHER ONE':
      return IMAGES.cover200.theOne
    case 'METAL FORTH':
      return IMAGES.cover200.metalForth
    case 'SINGLE':
      return IMAGES.cover200.single
    default:
      return IMAGES.cover200.notFound
  }
}

export const songList$ = (sortType?: SongListType) =>
  computed<ListItemType[]>(() => {
    const data = store$.get()
    if (!data) return []

    return Object.values(data)
      .filter((item): item is SongType & { deleted: false } => {
        const isValid = !(!item || item.deleted)
        if (!isValid) return false

        if (sortType === 'Release') {
          return (
            !!item.song_release_year && item.song_release_year.trim() !== ''
          )
        }
        return true
      })
      .sort((a, b) => {
        switch (sortType) {
          case 'Title':
            return a.song_title.localeCompare(b.song_title)
          case 'Appearance':
            return (
              new Date(a.song_first_appearance).getTime() -
              new Date(b.song_first_appearance).getTime()
            )
          case 'Release':
            return a.song_id.localeCompare(b.song_id)
          default:
            return a.song_id.localeCompare(b.song_id)
        }
      })
      .map(
        (item): ListItemType => ({
          id: item.id,
          line1: item.song_title,
          line2:
            sortType === 'Appearance'
              ? item.song_first_appearance
              : item.song_artist,
          icon: getSongCover(item.song_default_cover),
          route: {
            pathname: '/(main)/(tabs)/fox/songs/SongDetail',
            params: { id: item.id },
          } as Href,
        }),
      )
  })

export const songsCount$ = computed(() => {
  const data = songs$.get() // React to changes in the store
  if (!data) return 0
  return Object.values(data).filter(item => item && !item.deleted).length
})

export const getRandomSongPreviews = (): {
  winner: PreviewSong
  options: ListItemType[]
} | null => {
  const data = songs$.peek()
  if (!data) return null

  const validSongs = Object.values(data).filter(
    (item): item is SongType => !!item && !item.deleted && !!item.song_preview,
  )

  if (validSongs.length < 5) return null

  // 1. Pick Winner
  const winnerIndex = Math.floor(Math.random() * validSongs.length)
  const winnerItem = validSongs[winnerIndex]

  const winner: PreviewSong = {
    song_preview: winnerItem.song_preview,
    song_title: winnerItem.song_title,
    song_artist: winnerItem.song_artist,
    song_preview_artwork: winnerItem.song_preview_artwork,
    song_preview_uri: winnerItem.song_preview_uri,
  }

  // 2. Pick 4 unique distractors
  const pool = validSongs.filter(s => s.id !== winnerItem.id)
  const shuffledPool = [...pool].sort(() => 0.5 - Math.random())
  const distractors = shuffledPool.slice(0, 4)

  // 3. Combine and Shuffle
  const optionsRaw = [winnerItem, ...distractors].sort(
    () => 0.5 - Math.random(),
  )

  // 4. Map to ListItemType
  const options: ListItemType[] = optionsRaw.map((item, index) => ({
    id: item.id,
    line1: item.song_title,
    line2: item.song_artist,
    value: item.id === winnerItem.id ? 'WIN' : 'LOOSE',
    icon: (index + 1).toString(),
    route: null,
  }))

  return { winner, options }
}

import { observable } from '@legendapp/state'

export interface PreviewSong {
  song_preview: string | null
  song_title: string | null
  song_artist: string | null
  song_preview_artwork: string | null
  song_preview_uri: string | null
}

export const activePreviewSong$ = observable<PreviewSong | null>(null)

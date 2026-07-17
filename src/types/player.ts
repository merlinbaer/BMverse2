export interface PreviewSong {
  song_preview: string | null
  song_title: string | null
  song_artist: string | null
  song_preview_artwork: string | null
  song_preview_uri: string | null
}

export interface CoverFile {
  id: string
  importedAt: string
  origFilename: string
  // Diagnostics tag
  fileFormat: 'png' | 'jpg' | 'asset'
  coverUri: string | number
}

export interface MusicFile {
  id: string
  importedAt: string
  origFilename: string
  audioUri: string
  coverUri: string | null

  // Diagnostics tags
  fileFormat: 'mp3' | 'm4a' | null
  tagVersion: string | null
  // Original meta tags
  origTitle: string | null
  origArtist: string | null
  origAlbum: string | null
  origTrack: number | null
  origDisc: number | null
  origYear: number | null
  origLyrics: string | null

  // App-specific editable metadata
  title: string
  artist: string | null
  album: string | null
  lyrics: string | null
  appCoverUri: string | null
}

export interface PlaylistTrack {
  musicFileId: string // Reference to MusicFile.id
  trackNum: number
}

export interface Playlist {
  id: string
  name: string
  imageUri: string | null
  tracks: PlaylistTrack[]
}

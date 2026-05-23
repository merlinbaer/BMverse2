import { useValue } from '@legendapp/state/react'
import React from 'react'
import { StyleSheet } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { songSort$ } from '@/services/legend'
import { SongListType } from '@/types/list'

const SongSort = () => {
  const currentSort = useValue(songSort$)

  const updateSortSongs = (sorting: SongListType, dismiss: () => void) => {
    songSort$.set(sorting)
    dismiss()
  }

  return (
    <AppModalScreen>
      {dismiss => (
        <>
          <AppText style={styles.title}>List by</AppText>
          <AppButton
            title="Release"
            disabled={currentSort === 'Release'}
            onPress={() => updateSortSongs('Release', dismiss)}
          />
          <AppButton
            title="Appearance"
            disabled={currentSort === 'Appearance'}
            onPress={() => updateSortSongs('Appearance', dismiss)}
          />
          <AppButton
            title="Title"
            disabled={currentSort === 'Title'}
            onPress={() => updateSortSongs('Title', dismiss)}
          />
        </>
      )}
    </AppModalScreen>
  )
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
})

export default SongSort

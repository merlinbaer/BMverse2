import React from 'react'
import { StyleSheet } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'

const SongSort = () => {
  const updateSortSongs = (sorting: string, dismiss: () => void) => {
    console.log('Sorting selected:', sorting)
    // Perform your sorting logic here
    dismiss()
  }

  return (
    <AppModalScreen>
      {dismiss => (
        <>
          <AppText style={styles.title}>List by</AppText>
          <AppButton
            title="release"
            onPress={() => updateSortSongs('release', dismiss)}
          />
          <AppButton
            title="appearance"
            onPress={() => updateSortSongs('appearance', dismiss)}
          />
          <AppButton
            title="title"
            onPress={() => updateSortSongs('title', dismiss)}
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

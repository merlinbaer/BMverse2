import { useValue } from '@legendapp/state/react'
import React from 'react'
import { StyleSheet } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { videoSort$ } from '@/services/legend/memory/variables'
import { VideoListType } from '@/types/list'

const VideoSort = () => {
  const currentSort = useValue(videoSort$)

  const updateSortVideos = (sorting: VideoListType, dismiss: () => void) => {
    videoSort$.set(sorting)
    dismiss()
  }

  return (
    <AppModalScreen>
      {dismiss => (
        <>
          <AppText style={styles.title}>List by</AppText>
          <AppButton
            title="Views"
            disabled={currentSort === 'Views'}
            onPress={() => updateSortVideos('Views', dismiss)}
          />
          <AppButton
            title="Newest"
            disabled={currentSort === 'Newest'}
            onPress={() => updateSortVideos('Newest', dismiss)}
          />
          <AppButton
            title="Title"
            disabled={currentSort === 'Title'}
            onPress={() => updateSortVideos('Title', dismiss)}
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

export default VideoSort

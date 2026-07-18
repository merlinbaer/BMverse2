import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppFlatList } from '@/components/AppFlatList'
import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { ListItemType } from '@/types/list'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface MusicFileListSelectorProps {
  title: string
  data: ListItemType[]
  onSelect: (item: ListItemType, dismiss: () => void) => void
}

export const MusicFileListSelector = ({
  title,
  data,
  onSelect,
}: MusicFileListSelectorProps) => {
  return (
    <AppModalScreen>
      {dismiss => (
        <View style={styles.container}>
          <AppText style={styles.title}>{title}</AppText>
          <View style={styles.listWrapper}>
            <AppFlatList
              data={data}
              displayIconAsText={true}
              pressAction={{ type: 'none' }}
              onPressItem={item => onSelect(item, dismiss)}
              scrollEnabled={true}
              style={styles.flatList}
            />
          </View>
          <View style={styles.footer}>
            <AppButton
              title="Cancel"
              onPress={dismiss}
              style={styles.cancelButton}
            />
          </View>
        </View>
      )}
    </AppModalScreen>
  )
}

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: COLORS.BM_DARK_RED,
  },
  container: {
    height: SCREEN_HEIGHT * 0.7,
    justifyContent: 'space-between',
  },
  flatList: {
    backgroundColor: COLORS.BG_GREY,
  },
  footer: {
    paddingTop: 10,
  },
  listWrapper: {
    flex: 1,
    marginVertical: 12,
  },
  title: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.LG,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

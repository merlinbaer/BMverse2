import React from 'react'
import { Platform, StyleSheet } from 'react-native'

import { LAYOUT } from '@/constants/constants'
import { ListItemType } from '@/types/list'

import { AppFlatList } from './AppFlatList'

interface AppListScreenProps {
  data: ListItemType[]
  children?: React.ReactNode // For Stack.Screen
}

export function AppListScreen({ data, children }: AppListScreenProps) {
  return (
    <React.Fragment>
      {children}
      <AppFlatList
        data={data}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={true} // Opt-in to scrolling for pure list screens
      />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: Platform.select({
      ios: 80,
      android: 100,
      default: 90,
    }),
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: 12,
  },
})

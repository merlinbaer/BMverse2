import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useValue } from '@legendapp/state/react'
import { Stack, useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { AppListScreen } from '@/components/AppListScreen'
import { LayoutScreenHeader } from '@/constants/constants'
import { songList$ } from '@/services/legend'

export default function SongsScreen() {
  const router = useRouter()
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      ...LayoutScreenHeader,
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push('/fox/songs/SongSort')}>
          <View style={styles.sortButton}>
            <MaterialIcons name="sort" size={24} color="white" />
          </View>
        </TouchableOpacity>
      ),
    })
  }, [navigation, router])

  const list$ = useMemo(() => songList$(), [])
  const data = useValue(list$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Songs' }} />
    </AppListScreen>
  )
}

const styles = StyleSheet.create({
  sortButton: {
    paddingBottom: 2,
    paddingRight: Platform.select({
      ios: 2,
      android: 6,
      web: 36,
    }),
    paddingTop: Platform.select({
      ios: 2,
      android: (StatusBar.currentHeight ?? 0) + 2,
      default: 2,
    }),
  },
})

import { useValue } from '@legendapp/state/react'
import { Button, FlatList, StyleSheet, Text, View } from 'react-native'

import { AppText } from '@/components/AppText'
import { COLORS } from '@/constants/constants'
import {
  addNews,
  clearCacheNews,
  deleteNews,
  newsItem$,
  newsList$,
  syncNews,
  updateNews,
} from '@/services/legend'
import { authUser$ } from '@/services/legend/memory/variables'

function DemoItem({ id }: { id: string }) {
  const item = useValue(newsItem$(id))
  if (!item) return null

  return (
    <View style={styles.itemContainer}>
      <AppText style={styles.Text}>Updater: {item.news_updater}</AppText>
      <AppText style={styles.Text}>News: {item.news_info}</AppText>
      <AppText style={styles.Text}>ID: {item.id}</AppText>
      <AppText style={styles.Text}>
        Created: {item.created_at ? item.created_at : 'Syncing from cloud...'}
      </AppText>
      <AppText style={styles.Text}>
        Updated: {item.updated_at ? item.updated_at : 'Syncing from cloud...'}
      </AppText>
      <Button title="Invalidate News" onPress={() => updateNews(item.id)} />
      <Button title="Delete Row" onPress={() => deleteNews(item.id)} />
    </View>
  )
}

export default function HomeScreen() {
  const data = useValue(newsList$)
  const user = useValue(authUser$)

  if (!user) {
    return (
      <View style={styles.container}>
        <AppText>You are not logged in or you are offline. </AppText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Clear Cache and Sync"
          color={'orange'}
          onPress={() => clearCacheNews()}
        />
        <Button title="Just Sync" color={'orange'} onPress={() => syncNews()} />
        <Button title="Add New Row" onPress={() => addNews()} />
      </View>
      {!data || data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No data found</Text>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          automaticallyAdjustsScrollIndicatorInsets
          data={data}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          contentInsetAdjustmentBehavior="automatic"
          scrollEventThrottle={16}
          renderItem={({ item }) => <DemoItem id={item.id} />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  Text: {
    fontSize: 12,
  },
  container: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  flatList: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    gap: 12,
    padding: 10,
  },
  itemContainer: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
})

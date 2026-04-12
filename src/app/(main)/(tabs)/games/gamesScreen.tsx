import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppMarkdown } from '@/components/AppMarkdown'
import { AppText } from '@/components/AppText'
import { COLORS, LAYOUT } from '@/constants/constants'
import {
  authUser$,
  newsAdd,
  newsClearCache,
  newsDelete,
  newsItem$,
  newsList$,
  newsSync,
  newsUpdate,
} from '@/services/legend'

function DemoItem({ id }: { id: string }) {
  const item = useValue(newsItem$(id))
  if (!item) return null

  return (
    <View style={styles.itemContainer}>
      <AppText style={styles.Text}>
        Updater: {item.news_updater || 'Syncing from cloud...'}
      </AppText>
      <AppText style={styles.Text}>
        News: {item.news_info || 'Syncing from cloud...'}
      </AppText>
      <AppText style={styles.Text}>ID: {item.id}</AppText>
      <AppText style={styles.Text}>
        Created: {item.created_at || 'Syncing from cloud...'}
      </AppText>
      <AppText style={styles.Text}>
        Updated: {item.updated_at || 'Syncing from cloud...'}
      </AppText>
      <Button title="Invalidate News" onPress={() => newsUpdate(item.id)} />
      <Button title="Delete Row" onPress={() => newsDelete(item.id)} />
    </View>
  )
}

export default function HomeScreen() {
  const data = useValue(newsList$)
  const user = useValue(authUser$)

  const onClearCacheAndSyncPress = async () => {
    try {
      await newsClearCache()
      await newsSync()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Clear cache and sync failed'
      console.log('Error: ', message)
    }
  }

  if (!user) {
    return (
      <KeyboardAwareScrollView
        style={styles.keyboardAwareScrollView}
        contentContainerStyle={styles.keyboardAwareContentContainer}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
      >
        <Stack.Screen options={{ title: 'Music Player' }} />
        <View style={styles.characterContainer}>
          <AppMarkdown
            markup={'Only in IOS and Android when logged in.'}
            orientation={'center'}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Clear Cache and Sync"
          color={'orange'}
          onPress={() => onClearCacheAndSyncPress()}
        />
        <Button title="Just Sync" color={'orange'} onPress={() => newsSync()} />
        <Button title="Add New Row" onPress={() => newsAdd()} />
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
  characterContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  container: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
    paddingTop: Platform.select({
      ios: 170,
      android: 20,
      default: 10,
    }),
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
  keyboardAwareContentContainer: {
    gap: LAYOUT.gap,
    paddingBottom: 24,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 180,
      android: 20,
      default: 10,
    }),
  },
  keyboardAwareScrollView: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
})

import { useValue } from '@legendapp/state/react'
import { FlatList, StyleSheet } from 'react-native'

import { AppMarkdown } from '@/components/AppMarkdown'
import { COLORS, LAYOUT } from '@/constants/constants'
import { newsItem$, newsList$ } from '@/services/legend'

function NewsItem({ id }: { id: string }) {
  const item = useValue(newsItem$(id))
  if (!item) return null
  const footerText = item.news_update
    ? new Date(item.news_update).toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
    : ''
  return (
    <AppMarkdown
      markup={item.news_info}
      footer={footerText}
      orientation="left"
    />
  )
}

export default function NewsScreen() {
  const data = useValue(newsList$)

  return (
    <FlatList
      style={styles.flatList}
      automaticallyAdjustsScrollIndicatorInsets
      data={data}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      contentInsetAdjustmentBehavior="automatic"
      scrollEventThrottle={16}
      renderItem={({ item }) => <NewsItem id={item.id} />}
    />
  )
}

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 80,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
})

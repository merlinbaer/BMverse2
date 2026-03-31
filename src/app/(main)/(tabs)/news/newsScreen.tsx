import { useValue } from '@legendapp/state/react'
import { FlatList, StyleSheet, View } from 'react-native'
import Markdown from 'react-native-markdown-display'

import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { newsItem$, newsList$ } from '@/services/legend'

function NewsItem({ id }: { id: string }) {
  const item = useValue(newsItem$(id))
  if (!item) return null

  return (
    <View style={styles.itemContainer}>
      <Markdown style={markdownStyles}>{item.news_info}</Markdown>
      <View style={styles.footer}>
        <AppText style={styles.dateText}>{item.news_update}</AppText>
      </View>
    </View>
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

const markdownStyles = {
  body: {
    fontSize: FONT.SIZE.SM,
    color: COLORS.TEXT,
    fontWeight: '400' as const,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
    flexWrap: 'wrap' as const,
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'flex-start' as const,
  },
  link: {
    color: '#34b7f1',
    textDecorationLine: 'underline' as const,
  },
  strong: {
    fontWeight: 'bold' as const,
  },
  em: {
    fontStyle: 'italic' as const,
  },
}

const styles = StyleSheet.create({
  dateText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
  },
  flatList: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  footer: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  itemContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.MESSAGE_BUBBLE,
    borderRadius: 12,
    borderTopLeftRadius: 2,
    // Elevation for Android
    elevation: 1,
    // All
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    // Shadow for iOS
    shadowColor: COLORS.BACKGROUND,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 80,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
})

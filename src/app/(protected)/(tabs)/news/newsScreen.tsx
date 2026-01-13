import { AppText } from '@/components/AppText'
import { ScreenContainerScroll } from '@/components/ScreenContainerScroll'
import { FlatList, Platform, StyleSheet, View } from 'react-native'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import Markdown from 'react-native-markdown-display'
import { useMemo } from 'react'

export default function NewsScreen() {
  const data = useMemo(() => {
    return Array.from({ length: 20 }, (_, index) => {
      const messages = [
        'Welcome to the **news feed**!',
        'This is a sample message to demonstrate the **WhatsApp-style** bubble layout.',
        'News updates will appear here [regularly](https://bmverse.bruu.eu).',
        'You can scroll through the list to see older updates.',
        'Check out our website: https://bmverse.bruu.eu',
        'The bubbles are limited\n- in width\n- and align\n- to the left.',
        '**React Native FlatList** is used for efficient rendering.',
        '## This looks much better\n than random characters_!',
        'Stay tuned for *more updates* from BMverse.',
        'Enjoy the [new design](https://bmverse.bruu.eu)!',
      ]
      const randomText = messages[index % messages.length]
      const date = new Date(Date.now() - index * 3600000 * (Math.random() * 5))
      return {
        id: index.toString(),
        text: randomText,
        date: date,
      }
    }).sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [])

  return (
    <ScreenContainerScroll isList>
      <FlatList
        style={styles.flatList}
        automaticallyAdjustsScrollIndicatorInsets
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="automatic"
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Markdown style={markdownStyles}>{item.text}</Markdown>
            <View style={styles.footer}>
              <AppText style={styles.dateText}>
                {item.date.toLocaleDateString([], {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </AppText>
            </View>
          </View>
        )}
      />
    </ScreenContainerScroll>
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
  flatList: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  listContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingBottom: 24,
    gap: 12,
  },
  itemContainer: {
    backgroundColor: COLORS.MESSAGE_BUBBLE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderTopLeftRadius: 2,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    // Elevation for Android
    elevation: 1,
  },
  footer: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
  },
})

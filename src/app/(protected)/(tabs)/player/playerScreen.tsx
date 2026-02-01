import { Platform, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Markdown from 'react-native-markdown-display'

import { COLORS, FONT, LAYOUT } from '@/constants/constants'

export default function PlayerScreen() {
  const aMessage = 'Only in IOS and Android when logged in.'
  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <View style={styles.characterContainer}>
        {/* Su- at the top center */}
        <Markdown style={markdownStyles}>{aMessage}</Markdown>
      </View>
    </KeyboardAwareScrollView>
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
  characterContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
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
})

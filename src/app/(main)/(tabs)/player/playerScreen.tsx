import { Stack } from 'expo-router'
import { Platform, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppMarkup } from '@/components/AppMarkup'
import { COLORS, LAYOUT } from '@/constants/constants'

export default function PlayerScreen() {
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
        <AppMarkup
          markup={'Only in IOS and Android when logged in.'}
          orientation={'center'}
        />
      </View>
    </KeyboardAwareScrollView>
  )
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

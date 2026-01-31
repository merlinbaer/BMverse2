import { Image, Platform, Pressable, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { COLORS, LAYOUT } from '@/constants/constants'
import { useAlert } from '@/hooks/useAlert'

export default function MainScreen() {
  const { showAlert } = useAlert()

  const handlePressCharacter = (name: string) => {
    showAlert(name, `${name} pressed!`)
  }

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
        <Pressable
          onPress={() => handlePressCharacter('Su-')}
          style={styles.topImageWrapper}
        >
          <Image
            source={require('@/../assets/images/Su-.png')}
            style={styles.suImage}
            resizeMode="contain"
          />
        </Pressable>

        {/* Momo and Moa in a row underneath */}
        <View style={styles.rowContainer}>
          <Pressable onPress={() => handlePressCharacter('Momo')}>
            <Image
              source={require('@/../assets/images/Momo.png')}
              style={styles.sideImage}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable onPress={() => handlePressCharacter('Moa')}>
            <Image
              source={require('@/../assets/images/Moa.png')}
              style={styles.sideImage}
              resizeMode="contain"
            />
          </Pressable>
        </View>
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    width: '100%',
  },
  sideImage: {
    height: 120,
    width: 120,
  },
  suImage: {
    height: 140,
    width: 140,
  },
  topImageWrapper: {
    marginBottom: 60,
  },
})

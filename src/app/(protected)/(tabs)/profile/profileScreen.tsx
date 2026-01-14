import { AppButton } from '@/components/AppButton'
import { useAuth } from '@/hooks/useAuth'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLORS, LAYOUT } from '@/constants/constants'

export default function ProfileScreen() {
  const { signOut, restoring } = useAuth()

  const handleSignOut = async () => {
    if (restoring) {
      Alert.alert('Please wait', 'Session is restoring. Try again in a moment.')
      return
    }
    try {
      await signOut()
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', err.message || 'Failed to sign out.')
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <View style={styles.container} />
      <AppButton title="Sign Out" onPress={handleSignOut} />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  keyboardAwareScrollView: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardAwareContentContainer: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    gap: LAYOUT.gap,
    paddingTop: Platform.select({
      ios: 180,
      android: 20,
      default: 10,
    }),
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
})

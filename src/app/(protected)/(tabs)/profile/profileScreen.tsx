import { AppButton } from '@/components/AppButton'
import { useAuth } from '@/hooks/useAuth'
import { Platform, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { APP_VERSION } from '@/constants/constants'
import { AppText } from '@/components/AppText'
import { useMemo } from 'react'
import { useAlert } from '@/hooks/useAlert'

export default function ProfileScreen() {
  const { restoring, session, signOut, deleteAccount } = useAuth()
  const { showAlert } = useAlert()
  const userEmail = session?.user?.email ?? 'Unknown'

  const expiryLabel = useMemo(() => {
    if (session?.expires_at) {
      const date = new Date(session.expires_at * 1000)

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}/${month}/${day} at ${hours}:${minutes}:${seconds}`
    }
    return 'Not available'
  }, [session?.expires_at])

  const handleSignOut = async () => {
    if (restoring) {
      showAlert('Please wait', 'Session is restoring. Try again in a moment.')
      return
    }
    try {
      await signOut()
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      showAlert('Error', err.message || 'Failed to sign out.')
    }
  }
  const handleDeleteAccount = async () => {
    showAlert(
      'Delete Account',
      'Are you sure you want to permanently delete your account with all user data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount()
            } catch (err: any) {
              showAlert('Error', err.message || 'Failed to delete account.')
            }
          },
        },
      ],
    )
  }

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <AppText>Current App Version: {APP_VERSION}</AppText>
      <AppText>Available App Version: </AppText>
      <AppButton title="Sign Out" onPress={handleSignOut} />
      <AppButton title="Delete Account" onPress={handleDeleteAccount} />
      <AppText fontSize={FONT.SIZE.BASE}>Debug Info:</AppText>
      <AppText>User Email: {userEmail}</AppText>
      <AppText>Next Token Renew on {expiryLabel}</AppText>
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
})

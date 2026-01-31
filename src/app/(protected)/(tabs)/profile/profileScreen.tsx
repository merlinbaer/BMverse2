import { useValue } from '@legendapp/state/react'
// import { useObserve, useValue } from '@legendapp/state/react'
// import { useState } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { APP_VERSION, COLORS, FONT, LAYOUT } from '@/constants/constants'
import { useAlert } from '@/hooks/useAlert'
import { useAuth } from '@/hooks/useAuth'
import {
  useStoreProfile,
  useStoreSync,
  useStoreVersion,
} from '@/hooks/useStore'

export default function ProfileScreen() {
  const { restoring, session, signOut, deleteAccount } = useAuth()
  const { showAlert } = useAlert()
  const { updatedAt$ } = useStoreSync()
  const { dbVersion$, syncVersion, clearCacheVersion } = useStoreVersion()
  const { userName$, syncProfile, clearCacheProfile } = useStoreProfile()
  const syncUpdated = useValue(updatedAt$)
  const dbVersion = useValue(dbVersion$)
  const name = useValue(userName$)
  const userEmail = session?.user?.email ?? 'Unknown'
  let expiryLabel = 'Not available'
  if (session?.expires_at) {
    const date = new Date(session.expires_at * 1000)
    const pad = (n: number) => String(n).padStart(2, '0')

    expiryLabel = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} at ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }
  const handleDeleteVersion = async () => {
    // await clearCacheSync()
    await clearCacheVersion()
    await clearCacheProfile()
    //setLocalName('')
  }
  const handleSync = async () => {
    await syncProfile()
    await syncVersion()
  }
  const handleSignOut = async () => {
    if (restoring) {
      showAlert('Please wait', 'Session is restoring. Try again in a moment.')
      return
    }
    await signOut()
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
            await deleteAccount()
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
      <AppText>Available App Version: {dbVersion}</AppText>
      <AppButton title="Sync" onPress={handleSync} />
      <AppButton title="Clear Cache" onPress={handleDeleteVersion} />
      <AppText>Authentication: </AppText>
      <AppButton title="Sign Out" onPress={handleSignOut} />
      <AppButton title="Delete Account" onPress={handleDeleteAccount} />
      <AppText fontSize={FONT.SIZE.BASE}>Debug Info:</AppText>
      <AppText>User Email: {userEmail}</AppText>
      <AppText>User Name: {name}</AppText>

      <AppText>Next Token Renew on {expiryLabel}</AppText>
      <AppText>Sync Date: {syncUpdated}</AppText>
    </KeyboardAwareScrollView>
  )
}
/*

  // Use useState and useObserve to keep the local state in sync with external changes
  const [localName, setLocalName] = useState(userName$.get() ?? '')
  useObserve(userName$, ({ value }) => {
    const newValue = value ?? ''
    if (newValue !== localName) {
      setLocalName(newValue)
    }
  })

  const handleSetName = async () => {
    const currentProfile = userName$.get()
    // Only do change when profile$ is loaded and localName has changed
    if (currentProfile && localName !== currentProfile) {
      userName$.set(localName)
    }
  }
      <TextInput
        value={localName}
        onChangeText={setLocalName}
        onBlur={handleSetName}
        placeholder="Enter username"
        placeholderTextColor={COLORS.TEXT_MUTED}
        style={styles.textInput}
      />
 */
const styles = StyleSheet.create({
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
  textInput: {
    backgroundColor: COLORS.TEXT_INPUT,
    borderWidth: 1,
    color: COLORS.BACKGROUND, // Ensure text is visible on the light background used in login styles
    padding: 10,
  },
})

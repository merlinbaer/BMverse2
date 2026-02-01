import { useValue } from '@legendapp/state/react'
import { useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { Platform, StyleSheet, TextInput, View } from 'react-native'
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
  const { userName$, setUserName, syncProfile, clearCacheProfile } =
    useStoreProfile()
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
  // Explicitly blur the input whenever the user navigates away from this screen
  const inputRef = useRef<TextInput>(null)
  useFocusEffect(
    useCallback(() => {
      return () => {
        // This runs when the screen is blurred/unfocused (navigating away)
        inputRef.current?.blur()
      }
    }, []),
  )
  const [isTextChange, setTextChange] = useState(false)
  const [text, setText] = useState('')
  const handleChangeText = (value: string) => {
    setText(value)
    setTextChange(true)
  }
  const handleSetText = () => {
    if (isTextChange) {
      console.log('handleSetText: ' + text)
      setTextChange(false)
      setUserName(text.trim())
    }
  }

  const handleDeleteVersion = async () => {
    await clearCacheVersion()
    await clearCacheProfile()
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
      <AppText fontSize={FONT.SIZE.BASE}>App Version: {APP_VERSION}</AppText>
      <AppText>Available Version in App Store: {dbVersion}</AppText>
      <AppText fontSize={FONT.SIZE.BASE}>Authentication & Profile: </AppText>
      <AppText>User Email: {userEmail}</AppText>
      <View style={styles.inputRow}>
        <AppText style={styles.inputLabel}>User Name:</AppText>
        <TextInput
          ref={inputRef}
          value={isTextChange ? text : name}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSetText}
          onBlur={handleSetText}
          placeholder="Enter your Nickname"
          placeholderTextColor={COLORS.TEXT_MUTED}
          style={[
            styles.textInput,
            { color: isTextChange ? COLORS.BACKGROUND : COLORS.TEXT_MUTED },
          ]}
        />
      </View>
      <AppButton title="Sign Out" onPress={handleSignOut} />
      <AppButton title="Delete Account" onPress={handleDeleteAccount} />
      <AppText fontSize={FONT.SIZE.BASE}>Manage Datastore&#39;s:</AppText>
      <AppButton title="Sync" onPress={handleSync} />
      <AppButton title="Clear Cache" onPress={handleDeleteVersion} />
      <AppText fontSize={FONT.SIZE.BASE}>Debug Info:</AppText>
      <AppText>Next Token Renew on {expiryLabel}</AppText>
      <AppText>Last Server Change: {syncUpdated}</AppText>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  inputLabel: {
    flexShrink: 0,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  keyboardAwareContentContainer: {
    gap: LAYOUT.gap,
    paddingBottom: 120,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 170,
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
    flex: 2,
    padding: 10,
  },
})

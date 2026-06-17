import {
  Button,
  Collapsible,
  FieldGroup,
  Picker,
  Row,
  Spacer,
  Text,
  TextInput,
  type TextInputRef,
} from '@expo/ui'
import { useObservable, useValue } from '@legendapp/state/react'
import React, { useRef, useState } from 'react'
import { Platform } from 'react-native'

import { AUTH, COLORS } from '@/constants/constants'
import { useAlert } from '@/hooks/useAlert'
import { deleteAccount, signOut, startLogin, verifyOtp } from '@/services/auth'
import {
  authUser$,
  profileItem$,
  profileRegionUpdate,
  profileUsernameUpdate,
} from '@/services/legend'
import { UserRegion } from '@/types/tables'

const REGION = [
  { label: 'Unknown', value: 'UNKN' },
  { label: 'Japan', value: 'JPAN' },
  { label: 'North America', value: 'NOAM' },
  { label: 'Latin America', value: 'LATM' },
  { label: 'Continental Europe', value: 'EURO' },
  { label: 'UK & Ireland', value: 'UKIE' },
  { label: 'East Asia', value: 'EASI' },
  { label: 'Southeast Asia', value: 'SEAS' },
  { label: 'Australia & Oceania', value: 'OCEA' },
  { label: 'Middle East & Africa', value: 'MEAF' },
]

export const ProfileUserSection = () => {
  const { showAlert } = useAlert()
  const user = useValue(authUser$)
  const profile = useValue(profileItem$(user?.id ?? ''))
  const draftName$ = useObservable(profile?.user_name ?? '')
  const [openLogin, setOpenLogin] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const [openRegion, setOpenRegion] = useState(false)
  const currentRegionLabel = REGION.find(
    r => r.value === (profile?.user_region ?? 'UNKN'),
  )?.label
  const [emailValue, setEmailValue] = useState('')
  const emailRef = useRef<TextInputRef>(null)
  const codeRef = useRef<TextInputRef>(null)
  const nameRef = useRef<TextInputRef>(null)

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleStartLogin = async () => {
    const emailToLogin = emailValue.trim()
    if (!emailToLogin) return // Guard for empty inputs by blur interaction in web.
    if (!isValidEmail(emailToLogin)) {
      showAlert('Invalid Email', 'Please enter a valid email address.')
      return
    }

    try {
      await startLogin(emailToLogin)
      setEmailValue(emailToLogin)
      showAlert(
        'Email Sent',
        `A one-time password has been sent to ${emailToLogin}. Please check your inbox.`,
      )
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to start login process.'
      showAlert('Login Error', message)
    }
  }

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== AUTH.OTP_LENGTH || !/^\d+$/.test(code)) return

    try {
      const emailToUse = emailValue.trim()
      await verifyOtp(emailToUse, code)
      // Note: authUser$ is updated by the onAuthStateChange listener in services/auth.ts
      setOpenLogin(false)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Invalid passcode.'
      showAlert('Verification Failed', message)
    }
  }

  const handleUpdateName = () => {
    const newName = draftName$.get().trim()
    if (user?.id && newName !== (profile?.user_name ?? '')) {
      profileUsernameUpdate(user.id, newName)
    }
  }

  return (
    <>
      {Platform.OS === 'web' && <Spacer size={16} />}
      <FieldGroup.Section title="User">
        <Row>
          <Text>Status:</Text>
          <Spacer flexible />
          <Text>{user ? user.email : 'You are not logged in'}</Text>
        </Row>
        {user ? (
          <>
            <Collapsible
              isOpen={openLogout}
              onOpenChange={setOpenLogout}
              label="Logout"
            >
              <Row>
                <Text> </Text>
                <Spacer flexible />
                <Button label="Logout" onPress={() => void signOut()} />
                <Spacer flexible />
              </Row>
              {Platform.OS === 'web' && <Spacer size={8} />}
              <Row>
                <Text> </Text>
                <Spacer flexible />
                {Platform.OS === 'ios' && (
                  <Button
                    variant="text"
                    label="Delete Account"
                    onPress={() => void deleteAccount()}
                    style={{
                      backgroundColor: COLORS.PRIMARY,
                      borderRadius: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  />
                )}
                {Platform.OS !== 'ios' && (
                  <Button
                    label="Delete Account"
                    onPress={() => void deleteAccount()}
                  >
                    <Text textStyle={{ color: COLORS.PRIMARY }}>
                      Delete Account
                    </Text>
                  </Button>
                )}
                <Spacer flexible />
              </Row>
            </Collapsible>
            <Row spacing={8}>
              <Text>Nickname:</Text>
              <TextInput
                key={profile?.user_name ?? 'empty'}
                ref={nameRef}
                placeholder="Type here"
                defaultValue={profile?.user_name ?? ''}
                onChangeText={val => draftName$.set(val)}
                onSubmitEditing={handleUpdateName}
                onBlur={handleUpdateName}
              />
            </Row>
            <Collapsible
              isOpen={openRegion}
              onOpenChange={setOpenRegion}
              label={`Your Region: ${currentRegionLabel}`}
            >
              <Picker
                selectedValue={profile?.user_region ?? 'UNKN'}
                onValueChange={(itemValue: UserRegion) => {
                  if (user?.id) {
                    profileRegionUpdate(user.id, itemValue)
                    setOpenRegion(false)
                  }
                }}
                appearance="wheel"
              >
                {REGION.map(f => (
                  <Picker.Item key={f.value} label={f.label} value={f.value} />
                ))}
              </Picker>
              {Platform.OS !== 'ios' && <Spacer size={8} />}
            </Collapsible>
            <Row>
              <Text>Role:</Text>
              <Spacer flexible />
              <Text>{profile?.user_role ?? 'Unknown'}</Text>
            </Row>
          </>
        ) : (
          <Collapsible
            isOpen={openLogin}
            onOpenChange={setOpenLogin}
            label="Login"
          >
            <Row spacing={8}>
              <Text>Enter Email:</Text>
              <TextInput
                ref={emailRef}
                placeholder="Type here"
                defaultValue={emailValue}
                onChangeText={setEmailValue}
                keyboardType="email-address"
                onSubmitEditing={handleStartLogin}
                onBlur={Platform.OS === 'web' ? handleStartLogin : undefined}
              />
            </Row>
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Row spacing={8}>
              <Text>Received Passcode:</Text>
              <TextInput
                ref={codeRef}
                keyboardType="number-pad"
                placeholder="Type here"
                onChangeText={value => {
                  if (value.length === AUTH.OTP_LENGTH) {
                    void handleVerifyOtp(value)
                  }
                }}
              />
            </Row>
          </Collapsible>
        )}
      </FieldGroup.Section>
    </>
  )
}

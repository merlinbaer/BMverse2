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
import { useValue } from '@legendapp/state/react'
import React, { useRef, useState } from 'react'
import { Alert, Platform } from 'react-native'

import { AUTH, COLORS } from '@/constants/constants'
import { deleteAccount, signOut, startLogin, verifyOtp } from '@/services/auth'
import { authUser$ } from '@/services/legend'

const REGION = [
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Japan', value: 'JP' },
  { label: 'US', value: 'US' },
  { label: 'Europe', value: 'Europe' },
  { label: 'North America', value: 'NAM' },
  { label: 'Central America', value: 'CAM' },
  { label: 'South America', value: 'SAM' },
  { label: 'East-Asia', value: 'EAS' },
  { label: 'West-Asia', value: 'WAS' },
  { label: 'Australia & Oceania', value: 'AU' },
  { label: 'Africa', value: 'AF' },
]

export const ProfileUserSection = () => {
  const user = useValue(authUser$)
  const [openLogin, setOpenLogin] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const [openRegion, setOpenRegion] = useState(false)
  const [region, setRegion] = useState('UN')
  const [emailValue, setEmailValue] = useState('')
  const emailRef = useRef<TextInputRef>(null)
  const codeRef = useRef<TextInputRef>(null)
  const nameRef = useRef<TextInputRef>(null)

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleStartLogin = async () => {
    const emailToLogin = emailValue.trim()
    if (!isValidEmail(emailToLogin)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.')
      return
    }

    try {
      await startLogin(emailToLogin)
      setEmailValue(emailToLogin)
      Alert.alert(
        'Email Sent',
        `A one-time password has been sent to ${emailToLogin}. Please check your inbox.`,
      )
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to start login process.'
      Alert.alert('Login Error', message)
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
      Alert.alert('Verification Failed', message)
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
                ref={nameRef}
                placeholder="Type here"
                onChangeText={value => console.log(value)}
              />
            </Row>
            <Collapsible
              isOpen={openRegion}
              onOpenChange={setOpenRegion}
              label="Your Region"
            >
              <Picker
                selectedValue={region}
                onValueChange={setRegion}
                appearance="wheel"
              >
                {REGION.map(f => (
                  <Picker.Item key={f.value} label={f.label} value={f.value} />
                ))}
              </Picker>
              {Platform.OS !== 'ios' && <Spacer size={8} />}
              <Row>
                <Text> </Text>
                <Spacer flexible />
                <Button
                  label="Set Region"
                  onPress={() => alert('Region pressed')}
                />
                <Spacer flexible />
              </Row>
            </Collapsible>
            <Row>
              <Text>Role:</Text>
              <Spacer flexible />
              <Text>User</Text>
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

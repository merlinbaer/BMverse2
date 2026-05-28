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
import React, { useRef, useState } from 'react'
import { Platform } from 'react-native'

import { COLORS } from '@/constants/constants'

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
  const [openLogin, setOpenLogin] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const [openRegion, setOpenRegion] = useState(false)
  const [region, setRegion] = useState('UN')
  const emailRef = useRef<TextInputRef>(null)
  const codeRef = useRef<TextInputRef>(null)
  const nameRef = useRef<TextInputRef>(null)

  return (
    <FieldGroup.Section title="User">
      <Row>
        <Text>Status:</Text>
        <Spacer flexible />
        <Text>You are not logged in</Text>
      </Row>
      <Collapsible isOpen={openLogin} onOpenChange={setOpenLogin} label="Login">
        <Row spacing={8}>
          <Text>Enter Email:</Text>
          <TextInput
            ref={emailRef}
            placeholder="Type here"
            onChangeText={value => console.log(value)}
          />
        </Row>
        {Platform.OS === 'web' && <Spacer size={8} />}
        <Row spacing={8}>
          <Text>Received Passcode:</Text>
          <TextInput
            ref={codeRef}
            keyboardType="numbers-and-punctuation"
            placeholder="Type here"
            onChangeText={value => console.log(value)}
          />
        </Row>
      </Collapsible>
      <Collapsible
        isOpen={openLogout}
        onOpenChange={setOpenLogout}
        label="Logout"
      >
        <Row>
          <Text> </Text>
          <Spacer flexible />
          <Button label="Logout" onPress={() => alert('Logout pressed')} />
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
              onPress={() => alert('Update Data pressed')}
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
              onPress={() => alert('Update Data pressed')}
            >
              <Text textStyle={{ color: COLORS.PRIMARY }}>Delete Account</Text>
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
          <Button label="Set Region" onPress={() => alert('Region pressed')} />
          <Spacer flexible />
        </Row>
      </Collapsible>
      <Row>
        <Text>Role:</Text>
        <Spacer flexible />
        <Text>User</Text>
      </Row>
    </FieldGroup.Section>
  )
}

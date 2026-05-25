import {
  Button,
  Collapsible,
  FieldGroup,
  Host,
  Picker,
  Row,
  Spacer,
  Switch,
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

const INTERVAL = [
  { label: '30 sec', value: '30000' },
  { label: '1 min', value: '60000' },
  { label: '2 min', value: '120000' },
  { label: '5 min', value: '300000' },
  { label: '10 min', value: '600000' },
]

export default function SettingsScreen() {
  const [openLogin, setOpenLogin] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const [openRegion, setOpenRegion] = useState(false)
  const [region, setRegion] = useState('UN')
  const emailRef = useRef<TextInputRef>(null)
  const codeRef = useRef<TextInputRef>(null)
  const nameRef = useRef<TextInputRef>(null)
  const [openDisclaimer, setOpenDisclaimer] = useState(false)
  const [openLinks, setOpenLinks] = useState(false)
  const [welcome, setWelcome] = useState(false)
  const [openSyncInterval, setOpenSyncInterval] = useState(false)
  const [interval, setInterval] = useState('30000')
  const [openClearCache, setOpenClearCache] = useState(false)
  const [openManage, setOpenManage] = useState(false)
  const [openStat, setOpenStat] = useState(true)

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="Version">
          <Row>
            <Text>Current App Version:</Text>
            <Spacer flexible />
            <Text>2.0.0</Text>
          </Row>
          <Row>
            <Text>Download Version:</Text>
            <Spacer flexible />
            <Text>2.0.1</Text>
          </Row>
        </FieldGroup.Section>
        <FieldGroup.Section title="User">
          <Row>
            <Text>Status:</Text>
            <Spacer flexible />
            <Text>You are not logged in</Text>
          </Row>
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
        </FieldGroup.Section>
        <FieldGroup.Section title="Documentation">
          <Collapsible
            isOpen={openDisclaimer}
            onOpenChange={setOpenDisclaimer}
            label="Disclaimer"
          >
            <Text>
              BMverse has no affiliation, association, endorsement, or any
              connection to BABYMETAL, or any of its subsidiaries or affiliates.
              BMverse makes no claim to and has no ownership interest in any
              intellectual property owned by BABYMETAL or any of its affiliates.
            </Text>
          </Collapsible>
          <Collapsible
            isOpen={openLinks}
            onOpenChange={setOpenLinks}
            label="Visit"
          >
            <Button
              label="Website"
              onPress={() => alert('Visit website pressed')}
            />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button label="Q&A" onPress={() => alert('Visit Q&A pressed')} />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button
              label="Terms"
              onPress={() => alert('Visit Terms pressed')}
            />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button
              label="Privacy"
              onPress={() => alert('Visit Privacy pressed')}
            />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button
              label="Contact"
              onPress={() => alert('Visit Contact pressed')}
            />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button
              label="Credits"
              onPress={() => alert('Visit Credits pressed')}
            />
          </Collapsible>

          <Switch
            label="Show Welcome Page"
            value={welcome}
            onValueChange={setWelcome}
          />
        </FieldGroup.Section>
        <FieldGroup.Section title="Data">
          <Collapsible
            isOpen={openSyncInterval}
            onOpenChange={setOpenSyncInterval}
            label="Sync"
          >
            <Row>
              <Text> </Text>
              <Spacer flexible />
              <Button
                label="Sync now"
                onPress={() => alert('Update Data pressed')}
              />
              <Spacer flexible />
            </Row>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Picker
              selectedValue={interval}
              onValueChange={setInterval}
              appearance="wheel"
            >
              {INTERVAL.map(f => (
                <Picker.Item key={f.value} label={f.label} value={f.value} />
              ))}
            </Picker>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Text> </Text>
              <Spacer flexible />
              <Button
                label="Set Interval"
                onPress={() => alert('Interval pressed')}
              />
              <Spacer flexible />
            </Row>
          </Collapsible>
          <Collapsible
            isOpen={openManage}
            onOpenChange={setOpenManage}
            label="Manage"
          >
            <Text>
              {`As Moderator you can add News and\nupdate Song Information.\nYour help is appreciated\nJoin the Discord channel.`}
            </Text>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Text> </Text>
              <Spacer flexible />
              <Button
                label="Add News"
                disabled={true}
                onPress={() => alert('Add News pressed')}
              />
              <Spacer flexible />
            </Row>
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Row>
              <Text> </Text>
              <Spacer flexible />
              <Button
                label="Update Songs"
                disabled={true}
                onPress={() => alert('Update Songs pressed')}
              />
              <Spacer flexible />
            </Row>
          </Collapsible>
          <Collapsible
            isOpen={openClearCache}
            onOpenChange={setOpenClearCache}
            label="Clear Cache"
          >
            <Text>
              {`All Cache Data will be deleted.\nApp will Restart and Reload.\nUse when Data seems to be corrupted.`}
            </Text>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Spacer flexible />
              <Button
                label="Clear Cache"
                onPress={() => alert('Clear Cache pressed')}
              />
              <Spacer flexible />
            </Row>
          </Collapsible>
        </FieldGroup.Section>
        <FieldGroup.Section title="Statistics">
          <Collapsible
            isOpen={openStat}
            onOpenChange={setOpenStat}
            label="Data"
          >
            <Row>
              <Text>Songs:</Text>
              <Spacer flexible />
              <Text>70</Text>
            </Row>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Text>Videos:</Text>
              <Spacer flexible />
              <Text>100</Text>
            </Row>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Text>Concerts:</Text>
              <Spacer flexible />
              <Text>200</Text>
            </Row>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Text>News:</Text>
              <Spacer flexible />
              <Text>150</Text>
            </Row>
          </Collapsible>
        </FieldGroup.Section>
        <FieldGroup.Section title=" "></FieldGroup.Section>
      </FieldGroup>
    </Host>
  )
}

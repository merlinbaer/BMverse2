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
import { useValue } from '@legendapp/state/react'
import * as WebBrowser from 'expo-web-browser'
import React, { useRef, useState } from 'react'
import { Platform } from 'react-native'

import { APP_VERSION, COLORS } from '@/constants/constants'
import {
  concertsCount$,
  latestVersion$,
  localStore$,
  newsList$,
  songList$,
  syncRefresh$,
  videoList$,
} from '@/services/legend'
import { clearCacheAll, syncAll } from '@/services/legend/lib'

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
  { label: '30 sec', value: 30 },
  { label: '1 min - Default', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
]

export default function ProfileScreen() {
  const latestVersion = useValue(latestVersion$)
  const [openLogin, setOpenLogin] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const [openRegion, setOpenRegion] = useState(false)
  const [region, setRegion] = useState('UN')
  const emailRef = useRef<TextInputRef>(null)
  const codeRef = useRef<TextInputRef>(null)
  const nameRef = useRef<TextInputRef>(null)
  const [openDisclaimer, setOpenDisclaimer] = useState(false)
  const [openLinks, setOpenLinks] = useState(false)
  const isOnboarding = useValue(localStore$.isOnboarding)
  const [openSyncInterval, setOpenSyncInterval] = useState(false)
  const syncRefresh = useValue(syncRefresh$)
  const [openClearCache, setOpenClearCache] = useState(false)
  const [openManage, setOpenManage] = useState(false)
  const [openStat, setOpenStat] = useState(true)
  const songsCount = useValue(songList$).length
  const videosCount = useValue(videoList$).length
  const concertsCount = useValue(concertsCount$)
  const newsCount = useValue(newsList$).length

  const handleOnPressVisit = async (hyperlink: string) => {
    console.log('Hyperlink-i: ' + hyperlink)
    await WebBrowser.openBrowserAsync(hyperlink)
  }

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="Version">
          <Row>
            <Text>Current App Version:</Text>
            <Spacer flexible />
            <Text>{APP_VERSION}</Text>
          </Row>
          <Row>
            <Text>Download Version:</Text>
            <Spacer flexible />
            <Text>{latestVersion ?? 'N/A'}</Text>
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
              onPress={() => handleOnPressVisit('https://bmverse.bruu.eu/')}
            />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button
              label="Q&A"
              onPress={() => handleOnPressVisit('https://bmverse.bruu.eu/qa/')}
            />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button
              label="Terms"
              onPress={() =>
                handleOnPressVisit(
                  'https://bmverse.bruu.eu/terms_and_conditions/',
                )
              }
            />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button
              label="Privacy"
              onPress={() =>
                handleOnPressVisit('https://bmverse.bruu.eu/privacy_policy/')
              }
            />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button
              label="Contact"
              onPress={() =>
                handleOnPressVisit('https://bmverse.bruu.eu/contact/')
              }
            />
            {Platform.OS === 'web' && <Spacer size={8} />}
            <Button
              label="Credits"
              onPress={() =>
                handleOnPressVisit('https://bmverse.bruu.eu/credits/')
              }
            />
          </Collapsible>
          <Switch
            label="Show Welcome Page"
            value={isOnboarding}
            onValueChange={value => localStore$.isOnboarding.set(value)}
          />
        </FieldGroup.Section>
        <FieldGroup.Section title="Data">
          <Collapsible
            isOpen={openSyncInterval}
            onOpenChange={setOpenSyncInterval}
            label="Sync"
          >
            <Text>
              {`Change Check Interval:\nA short network request checks periodically for changed data. When a change is discovered, only new or updated data will be syncronized, when you are online.`}
            </Text>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Picker
              selectedValue={syncRefresh}
              onValueChange={itemValue => {
                syncRefresh$.set(itemValue)
                setOpenSyncInterval(false)
              }}
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
                label="Sync now"
                onPress={() => {
                  void syncAll()
                  setOpenSyncInterval(false)
                }}
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
              {`As Moderator you can add News and\nupdate Song Information.\nYour help is appreciated. Join the Discord channel to become a moderator.`}
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
              {`All cached data will be deleted and reloaded.\nJust use when data seems to be corrupted.`}
            </Text>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Spacer flexible />
              <Button
                label="Clear Cache"
                onPress={() => {
                  void clearCacheAll()
                  void syncAll()
                  setOpenClearCache(false)
                }}
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
              <Text>{songsCount.toString()}</Text>
            </Row>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Text>Videos:</Text>
              <Spacer flexible />
              <Text>{videosCount.toString()}</Text>
            </Row>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Text>Concerts:</Text>
              <Spacer flexible />
              <Text>{concertsCount.toString()}</Text>
            </Row>
            {Platform.OS !== 'ios' && <Spacer size={8} />}
            <Row>
              <Text>News:</Text>
              <Spacer flexible />
              <Text>{newsCount.toString()}</Text>
            </Row>
          </Collapsible>
        </FieldGroup.Section>
        <FieldGroup.Section title=" "></FieldGroup.Section>
      </FieldGroup>
    </Host>
  )
}

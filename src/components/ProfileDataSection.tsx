import {
  Button,
  Collapsible,
  FieldGroup,
  Picker,
  Row,
  Spacer,
  Text,
} from '@expo/ui'
import { useValue } from '@legendapp/state/react'
import React, { useState } from 'react'
import { Platform } from 'react-native'

import { syncRefresh$ } from '@/services/legend'
import { clearCacheAll, syncAll } from '@/services/legend/lib'

const INTERVAL = [
  { label: '30 sec', value: 30 },
  { label: '1 min - Default', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
]

export const ProfileDataSection = () => {
  const [openSyncInterval, setOpenSyncInterval] = useState(false)
  const syncRefresh = useValue(syncRefresh$)
  const [openClearCache, setOpenClearCache] = useState(false)
  const [openManage, setOpenManage] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const onResetPress = async () => {
    setIsResetting(true)
    try {
      await clearCacheAll()
      void syncAll()
      setOpenClearCache(false)
    } catch (e) {
      console.error('Reset failed:', e)
    } finally {
      setIsResetting(false)
    }
  }
  return (
    <>
      {Platform.OS === 'web' && <Spacer size={16} />}
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
              label={isResetting ? 'Clearing...' : 'Clear Cache'}
              disabled={isResetting}
              onPress={onResetPress}
            />
            <Spacer flexible />
          </Row>
        </Collapsible>
      </FieldGroup.Section>
    </>
  )
}

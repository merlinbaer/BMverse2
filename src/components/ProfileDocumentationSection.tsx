import { Button, Collapsible, FieldGroup, Spacer, Switch, Text } from '@expo/ui'
import { useValue } from '@legendapp/state/react'
import * as WebBrowser from 'expo-web-browser'
import React, { useState } from 'react'
import { Platform } from 'react-native'

import { localStore$ } from '@/services/legend'

export const ProfileDocumentationSection = () => {
  const [openDisclaimer, setOpenDisclaimer] = useState(false)
  const [openLinks, setOpenLinks] = useState(false)
  const isOnboarding = useValue(localStore$.isOnboarding)

  const handleOnPressVisit = async (hyperlink: string) => {
    await WebBrowser.openBrowserAsync(hyperlink)
  }

  return (
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
      <Collapsible isOpen={openLinks} onOpenChange={setOpenLinks} label="Visit">
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
            handleOnPressVisit('https://bmverse.bruu.eu/terms_and_conditions/')
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
          onPress={() => handleOnPressVisit('https://bmverse.bruu.eu/contact/')}
        />
        {Platform.OS === 'web' && <Spacer size={8} />}
        <Button
          label="Credits"
          onPress={() => handleOnPressVisit('https://bmverse.bruu.eu/credits/')}
        />
      </Collapsible>
      <Switch
        label="Show Welcome Page"
        value={isOnboarding}
        onValueChange={value => localStore$.isOnboarding.set(value)}
      />
    </FieldGroup.Section>
  )
}

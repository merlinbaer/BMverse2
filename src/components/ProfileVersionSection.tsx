import { FieldGroup, Row, Spacer, Text } from '@expo/ui'
import { useValue } from '@legendapp/state/react'
import React from 'react'

import { APP_VERSION } from '@/constants/constants'
import { latestVersion$ } from '@/services/legend'

export const ProfileVersionSection = () => {
  const latestVersion = useValue(latestVersion$)

  return (
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
  )
}

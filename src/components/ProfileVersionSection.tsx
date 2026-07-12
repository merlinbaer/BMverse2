import { FieldGroup, Row, Spacer, Text } from '@expo/ui'
import { useValue } from '@legendapp/state/react'
import React from 'react'
import { Platform } from 'react-native'

import { APP_VERSION, COLORS } from '@/constants/constants'
import { latestVersion$ } from '@/services/legend'

export const ProfileVersionSection = () => {
  const latestVersion = useValue(latestVersion$)

  return (
    <>
      {Platform.OS === 'web' && <Spacer size={16} />}
      <FieldGroup.Section title="Version">
        <Row>
          <Text textStyle={{ color: COLORS.TEXT_MUTED }}>
            Current App Version:
          </Text>
          <Spacer flexible />
          <Text textStyle={{ color: COLORS.TEXT }}>{APP_VERSION}</Text>
        </Row>
        <Row>
          <Text textStyle={{ color: COLORS.TEXT_MUTED }}>
            Download Version:
          </Text>
          <Spacer flexible />
          <Text textStyle={{ color: COLORS.TEXT }}>
            {latestVersion ?? 'N/A'}
          </Text>
        </Row>
      </FieldGroup.Section>
    </>
  )
}

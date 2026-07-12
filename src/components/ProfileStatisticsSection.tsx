import { Collapsible, FieldGroup, Row, Spacer, Text } from '@expo/ui'
import { useValue } from '@legendapp/state/react'
import React, { useState } from 'react'
import { Platform } from 'react-native'

import { COLORS } from '@/constants/constants'
import {
  concertsCount$,
  newsCount$,
  songsCount$,
  videosCount$,
} from '@/services/legend'

export const ProfileStatsSection = () => {
  const [openStat, setOpenStat] = useState(true)
  const songsCount = useValue(songsCount$)
  const videosCount = useValue(videosCount$)
  const concertsCount = useValue(concertsCount$)
  const newsCount = useValue(newsCount$)

  return (
    <>
      {Platform.OS === 'web' && <Spacer size={16} />}
      <FieldGroup.Section title="Statistics">
        <Collapsible
          isOpen={openStat}
          onOpenChange={setOpenStat}
          labelStyle={{ color: COLORS.TEXT_MUTED }}
          label="Data"
        >
          <Row>
            <Text textStyle={{ color: COLORS.TEXT_MUTED }}>Songs:</Text>
            <Spacer flexible />
            <Text textStyle={{ color: COLORS.TEXT }}>
              {songsCount.toString()}
            </Text>
          </Row>
          {Platform.OS !== 'ios' && <Spacer size={8} />}
          <Row>
            <Text textStyle={{ color: COLORS.TEXT_MUTED }}>Videos:</Text>
            <Spacer flexible />
            <Text textStyle={{ color: COLORS.TEXT }}>
              {videosCount.toString()}
            </Text>
          </Row>
          {Platform.OS !== 'ios' && <Spacer size={8} />}
          <Row>
            <Text textStyle={{ color: COLORS.TEXT_MUTED }}>Concerts:</Text>
            <Spacer flexible />
            <Text textStyle={{ color: COLORS.TEXT }}>
              {concertsCount.toString()}
            </Text>
          </Row>
          {Platform.OS !== 'ios' && <Spacer size={8} />}
          <Row>
            <Text textStyle={{ color: COLORS.TEXT_MUTED }}>News:</Text>
            <Spacer flexible />
            <Text textStyle={{ color: COLORS.TEXT }}>
              {newsCount.toString()}
            </Text>
          </Row>
        </Collapsible>
      </FieldGroup.Section>
    </>
  )
}

import { Collapsible, FieldGroup, Row, Spacer, Text } from '@expo/ui'
import { useValue } from '@legendapp/state/react'
import React, { useState } from 'react'
import { Platform } from 'react-native'

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
        <Collapsible isOpen={openStat} onOpenChange={setOpenStat} label="Data">
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
    </>
  )
}

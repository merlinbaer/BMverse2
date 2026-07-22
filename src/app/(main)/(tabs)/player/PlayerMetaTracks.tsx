import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { musicFilesList$ } from '@/services/legend'

export default function PlayerMetaTracksScreen() {
  const list$ = useMemo(() => musicFilesList$(undefined, true), [])
  const data = useValue(list$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Select Music File' }} />
    </AppListScreen>
  )
}

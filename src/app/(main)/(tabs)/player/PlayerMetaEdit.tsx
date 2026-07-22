import { useLocalSearchParams } from 'expo-router'
import React from 'react'

import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'

export default function PlayerMetaEdit() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <AppScreen>
      <AppText>{id}</AppText>
    </AppScreen>
  )
}

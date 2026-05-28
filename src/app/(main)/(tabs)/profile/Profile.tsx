import { FieldGroup, Host } from '@expo/ui'
import React from 'react'

import { ProfileDataSection } from '@/components/ProfileDataSection'
import { ProfileDocumentationSection } from '@/components/ProfileDocumentationSection'
import { ProfileStatsSection } from '@/components/ProfileStatisticsSection'
import { ProfileUserSection } from '@/components/ProfileUserSection'
import { ProfileVersionSection } from '@/components/ProfileVersionSection'

export default function ProfileScreen() {
  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <ProfileVersionSection />
        <ProfileUserSection />
        <ProfileDocumentationSection />
        <ProfileDataSection />
        <ProfileStatsSection />
        <FieldGroup.Section title=" " />
      </FieldGroup>
    </Host>
  )
}

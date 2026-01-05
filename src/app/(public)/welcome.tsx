import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { ScreenContainer } from '@/components/ScreenContainer'
import { FONT } from '@/constants/constants'
import { Link } from 'expo-router'

export default function Page() {
  return (
    <ScreenContainer>
      <AppText style={{ fontSize: FONT.SIZE.SM }}>
        BMverse has no affiliation, association, endorsement, or any connection
        to BABYMETAL, or any of its subsidiaries or affiliates. BMverse makes no
        claim to and has no ownership interest in any intellectual property
        owned by BABYMETAL or any of its affiliates.
      </AppText>
      <AppText style={{ fontSize: FONT.SIZE.SM }}>
        Album cover provided by Apple Music. Music preview provided courtesy of
        iTunes. Youtube Videos and thumbnail images are under the license terms
        of YouTube.
      </AppText>
      <Link href="/login" asChild>
        <AppButton title="Accept" />
      </Link>
    </ScreenContainer>
  )
}
// <Link ... replace|push asChild>
//      {Array.from({ length: 10 }).map((_, i) => (
//        <AppText key={i}>Langer Inhalt → scrollt automatisch</AppText>

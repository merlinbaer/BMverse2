import { AppButton } from '@/components/AppButton'
import { ScreenContainerScroll } from '@/components/ScreenContainerScroll'
import { useAuth } from '@/hooks/useAuth'

export default function ProfileScreen() {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <ScreenContainerScroll>
      <AppButton title="Sign Out" onPress={handleSignOut} />
    </ScreenContainerScroll>
  )
}

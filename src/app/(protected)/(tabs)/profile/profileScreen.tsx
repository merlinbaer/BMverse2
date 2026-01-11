import { AppButton } from '@/components/AppButton'
import { ScreenContainerScroll } from '@/components/ScreenContainerScroll'
import { useAuth } from '@/hooks/useAuth'
import { Alert } from 'react-native'

export default function ProfileScreen() {
  const { signOut, restoring } = useAuth()

  const handleSignOut = async () => {
    if (restoring) {
      Alert.alert('Please wait', 'Session is restoring. Try again in a moment.')
      return
    }
    try {
      await signOut()
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', err.message || 'Failed to sign out.')
    }
  }

  return (
    <ScreenContainerScroll>
      <AppButton title="Sign Out" onPress={handleSignOut} />
    </ScreenContainerScroll>
  )
}

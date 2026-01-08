import { AppText } from '@/components/AppText'
import { View } from 'react-native'

// This page does nothing. But without this page the protected branch hangs in splashscreen
// todo: investigate
export default function Page() {
  return (
    <View>
      <AppText>Protected Screen</AppText>
    </View>
  )
}

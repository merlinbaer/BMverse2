import { FontAwesome } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'

import { LayoutScreenHeader } from '@/constants/constants'
import { headerStyles } from '@/layout/HeaderHelper'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...LayoutScreenHeader,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <View style={headerStyles.backButton}>
              <FontAwesome name="chevron-left" size={24} color="white" />
            </View>
          </TouchableOpacity>
        ),
      }}
    ></Stack>
  )
}

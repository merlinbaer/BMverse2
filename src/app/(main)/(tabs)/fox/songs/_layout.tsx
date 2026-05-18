import { FontAwesome } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'

import { COLORS, LayoutScreenHeader } from '@/constants/constants'
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
    >
      <Stack.Screen
        name="SongSort"
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: COLORS.TRANSPARENT,
          },
        }}
      />
    </Stack>
  )
}

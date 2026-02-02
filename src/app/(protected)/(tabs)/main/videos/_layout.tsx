import { FontAwesome } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'

import { LayoutScreenHeader } from '@/constants/constants'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...LayoutScreenHeader,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <View style={styles.backButton}>
              <FontAwesome name="chevron-left" size={24} color="white" />
            </View>
          </TouchableOpacity>
        ),
      }}
    ></Stack>
  )
}

const styles = StyleSheet.create({
  backButton: {
    paddingBottom: 2,
    paddingLeft: Platform.select({
      ios: 0,
      android: 0,
      web: 10,
      default: 0,
    }),
    paddingRight: 12,
    paddingTop: 8,
  },
})

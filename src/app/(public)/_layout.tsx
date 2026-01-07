import { FixedLargeHeaderIos } from '@/components/LargeHeader'
import { LayoutScreenHeader } from '@/constants/constants'
import { Stack } from 'expo-router'
import { Platform } from 'react-native'

export default function PublicLayout() {
  return (
    <Stack initialRouteName="welcome">
      <Stack.Screen
        name="welcome"
        options={{
          header:
            Platform.OS === 'ios'
              ? () => <FixedLargeHeaderIos title="Welcome" />
              : undefined,
          ...LayoutScreenHeader,
          headerTitle: 'Welcome',
        }}
      />
      <Stack.Screen
        name="login"
        options={{ ...LayoutScreenHeader, headerTitle: 'Login' }}
      />
      <Stack.Screen
        name="verify"
        options={{ ...LayoutScreenHeader, headerTitle: 'Verify' }}
      />
    </Stack>
  )
}

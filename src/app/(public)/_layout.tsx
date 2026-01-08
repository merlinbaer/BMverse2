import { LayoutScreenHeader } from '@/constants/constants'
import { Stack } from 'expo-router'

export default function PublicLayout() {
  return (
    <Stack initialRouteName="welcome">
      <Stack.Screen
        name="welcome"
        options={{ ...LayoutScreenHeader, headerTitle: 'Welcome' }}
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

/*  Use FixedLargeHeaderIos when the screen is Scrollview and the the return of a stacked view is not nice
      name="welcome"
        options={{
          header:
            Platform.OS === 'ios'
              ? () => <FixedLargeHeaderIos title="Welcome" />
              : undefined,
          ...LayoutScreenHeader,
          headerTitle: 'Welcome', */

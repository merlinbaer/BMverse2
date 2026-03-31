import { Stack } from 'expo-router'

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="(global)/player"
        options={{
          title: 'Player',
          headerBackButtonDisplayMode: 'minimal',
          headerTransparent: true,
        }}
      />
    </Stack>
  )
}

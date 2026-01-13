// (protected)/index.tsx
import { router } from 'expo-router'
import { useEffect } from 'react'

export default function ProtectedIndex() {
  useEffect(() => {
    router.replace('/(protected)/(tabs)/main/mainScreen') //start screen
  }, [])

  return null
}

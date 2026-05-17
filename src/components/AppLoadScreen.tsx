import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { AppBubbleText } from '@/components/AppBubbleText'
import { COLORS } from '@/constants/constants'

interface AppLoadScreenProps {
  /** Message to show after timeout. Default: 'Unknown data' */
  message?: string
  /** Duration in ms to show the ActivityIndicator before showing the message. Default: 3000 */
  timeout?: number
}

export function AppLoadScreen({
  message = 'Unknown data',
  timeout = 2000,
}: AppLoadScreenProps) {
  const [isTimedOut, setIsTimedOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true)
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout])

  return (
    <View style={styles.container}>
      {isTimedOut ? (
        <AppBubbleText markup={message} orientation="center" />
      ) : (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
    justifyContent: 'center',
    paddingTop: 64,
    width: '100%',
  },
})

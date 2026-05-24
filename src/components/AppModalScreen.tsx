import { useRouter } from 'expo-router'
import React, { ReactNode, useEffect } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { COLORS } from '@/constants/constants'

interface AppModalScreenProps {
  children: (dismiss: () => void) => ReactNode
}

export function AppModalScreen({ children }: AppModalScreenProps) {
  const router = useRouter()
  const { top } = useSafeAreaInsets()
  const startOffset = 600
  const translateY = useSharedValue(Platform.OS === 'ios' ? 0 : startOffset)

  const handleDismiss = React.useCallback(() => {
    translateY.set(
      withTiming(startOffset, { duration: 250 }, finished => {
        if (finished) {
          runOnJS(router.back)()
        }
      }),
    )
  }, [router, startOffset, translateY])

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      translateY.set(
        withSpring(0, {
          damping: 25,
          stiffness: 80,
          mass: 0.5,
        }),
      )
    }
  }, [translateY])

  const gesture = Gesture.Pan()
    .onUpdate(event => {
      if (event.translationY > 0) translateY.set(event.translationY)
    })
    .onEnd(event => {
      if (event.translationY > 150 || event.velocityY > 500) {
        runOnJS(handleDismiss)()
      } else {
        translateY.set(withSpring(0, { damping: 20 }))
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: interpolate(translateY.value, [0, 500, 700], [1, 1, 0], 'clamp'),
  }))

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, 400], [1, 0], 'clamp'),
  }))

  return (
    <GestureHandlerRootView style={styles.screenWrapper}>
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss} />
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.modalCard, { marginTop: top + 60 }, animatedStyle]}
        >
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          {children(handleDismiss)}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: COLORS.BACKDROP },
  handle: {
    backgroundColor: COLORS.MINIMUM_TRACK_TINT_COLOR,
    borderRadius: 3,
    height: 6,
    opacity: 0.5,
    width: 50,
  },
  handleContainer: { alignItems: 'center', marginBottom: 10, marginTop: -10 },
  modalCard: {
    backgroundColor: COLORS.MODAL_BACKGROUND,
    borderColor: COLORS.MODAL_BORDER,
    borderRadius: 24,
    borderWidth: 1,
    gap: 20,
    minHeight: 320,
    padding: 24,
    width: '90%',
  },
  screenWrapper: {
    alignItems: 'center',
    backgroundColor: COLORS.TRANSPARENT,
    flex: 1,
    justifyContent: 'flex-start',
  },
})

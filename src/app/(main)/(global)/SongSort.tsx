import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
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
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppButton } from 'src/components/AppButton'
import { AppText } from 'src/components/AppText'
import { COLORS } from 'src/constants/constants'

const SortSongs = () => {
  const router = useRouter()
  const translateY = useSharedValue(0)

  const updateSortSongs = (sorting: string) => {
    console.log('Sorting: ' + sorting)
    router.back()
  }
  const { top } = useSafeAreaInsets()

  const gesture = Gesture.Pan()
    .onUpdate(event => {
      // Only allow dragging downwards
      if (event.translationY > 0) {
        translateY.value = event.translationY
      }
    })
    .onEnd(event => {
      if (event.translationY > 150 || event.velocityY > 500) {
        // Dismiss if swiped far enough or fast enough
        // Pass the callback directly to withSpring.
        // Reanimated handles the JS execution automatically.
        translateY.value = withSpring(800, { damping: 50 }, finished => {
          if (finished) {
            runOnJS(router.back)()
          }
        })
      } else {
        // Snap back to position
        translateY.value = withSpring(0)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: interpolate(translateY.value, [0, 500, 700], [1, 1, 0], 'clamp'),
  }))

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    // interpolate (value, [inputRange], [outputRange], extrapolate)
    // Here: when translateY is 0, opacity is 1.
    // When translateY reaches 200, opacity is already 0 (fades out faster).
    const opacity = interpolate(translateY.value, [0, 200], [1, 0], 'clamp')
    return { opacity }
  })

  return (
    <GestureHandlerRootView style={styles.screenWrapper}>
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => router.back()}
        />
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.modalCard, { marginTop: top + 60 }, animatedStyle]}
        >
          <DismissPlayerSymbol />
          <AppText style={styles.title}>Sort and Filter by</AppText>
          <AppButton
            title={'release'}
            onPress={() => updateSortSongs('release')}
          />
          <AppButton
            title={'appearance'}
            onPress={() => updateSortSongs('appearance')}
          />
          <AppButton title={'title'} onPress={() => updateSortSongs('title')} />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

const DismissPlayerSymbol = () => {
  return (
    <View style={styles.handleContainer}>
      <View style={styles.handle} />
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.BACKDROP,
  },
  handle: {
    backgroundColor: COLORS.MINIMUM_TRACK_TINT_COLOR,
    borderRadius: 3,
    height: 6,
    opacity: 0.5,
    width: 50,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -10,
  },
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
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
})

export default SortSongs

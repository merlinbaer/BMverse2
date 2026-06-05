import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedProps } from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

import { AppText } from '@/components/AppText'
import { COLORS } from '@/constants/constants'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface SongTimerCircleProps {
  size?: number
  currentTime: number
  duration: number
}

export const SongTimerCircle = ({
  size = 40,
  currentTime,
  duration,
}: SongTimerCircleProps) => {
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const center = size / 2

  // Calculate remaining time
  const remaining = Math.max(0, Math.ceil(duration - currentTime))

  // Logic for the border offset
  // When currentTime is 0, offset is 0 (Full Red)
  // When currentTime is duration, offset is circumference (Empty)
  const animatedProps = useAnimatedProps(() => {
    const percentage = duration > 0 ? currentTime / duration : 0
    const strokeDashoffset = circumference * percentage

    return {
      strokeDashoffset,
    }
  })

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Inner Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill={COLORS.MODAL_BORDER}
          stroke={COLORS.MODAL_BORDER}
          strokeWidth={strokeWidth}
        />
        {/* Red Border (The Counter) */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={COLORS.PRIMARY}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
          // Starts at 12 o'clock
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {/* Centered Countdown Number */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.textContainer}>
          <AppText fontSize={size * 0.4} style={styles.text}>
            {remaining.toString()}
          </AppText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})

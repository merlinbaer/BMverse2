import React, { useEffect } from 'react'
import { DimensionValue, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { COLORS } from '@/constants/constants'

interface AudioWaveVisualizerProps {
  width?: DimensionValue
  height?: DimensionValue
}

const BARS = [
  { values: [30, 100, 45, 120, 30], duration: 3200 },
  { values: [50, 130, 70, 110, 50], duration: 2800 },
  { values: [20, 80, 40, 90, 20], duration: 3600 },
  { values: [70, 150, 90, 130, 70], duration: 2400 },
  { values: [40, 110, 60, 100, 40], duration: 3000 },
  { values: [30, 90, 50, 140, 30], duration: 3400 },
  { values: [80, 160, 100, 150, 80], duration: 2600 },
  { values: [20, 70, 35, 100, 20], duration: 3800 },
  { values: [60, 120, 80, 140, 60], duration: 2200 },
  { values: [40, 100, 55, 110, 40], duration: 3100 },
  { values: [70, 140, 90, 120, 70], duration: 2700 },
  { values: [30, 110, 45, 100, 30], duration: 3500 },
  { values: [50, 130, 75, 150, 50], duration: 2300 },
  { values: [20, 90, 40, 80, 20], duration: 3700 },
  { values: [60, 140, 100, 130, 60], duration: 2900 },
]

function VisualizerBar({
  values,
  duration,
  containerHeight,
}: {
  values: number[]
  duration: number
  containerHeight: number
}) {
  const progress = useSharedValue(values[0])

  useEffect(() => {
    const segment = duration / (values.length - 1)

    progress.value = withRepeat(
      withSequence(
        ...values.slice(1).map(v => withTiming(v, { duration: segment })),
      ),
      -1,
      false,
    )
  }, [duration, progress, values])

  const animatedStyle = useAnimatedStyle(() => ({
    // Scale the 0-160 range of BARS to the actual container height
    height: interpolate(progress.value, [0, 160], [0, containerHeight]),
  }))

  return (
    <Animated.View
      style={[
        {
          flex: 1, // Let bars scale width based on container
          maxWidth: 12,
          borderRadius: 2,
          backgroundColor: COLORS.PRIMARY,
        },
        animatedStyle,
      ]}
    />
  )
}

export default function AudioWaveVisualizer({
  width = 320,
  height = 200,
}: AudioWaveVisualizerProps) {
  const numericHeight = typeof height === 'number' ? height : 200
  return (
    <View
      style={{
        width,
        height,
        justifyContent: 'flex-end',
        alignItems: 'flex-start', // Changed from center to left aligned
      }}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 4,
        }}
      >
        {BARS.map((bar, index) => (
          <VisualizerBar
            key={index}
            values={bar.values}
            duration={bar.duration}
            containerHeight={numericHeight}
          />
        ))}
      </View>
    </View>
  )
}

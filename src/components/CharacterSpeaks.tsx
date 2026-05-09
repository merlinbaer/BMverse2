import { Image } from 'expo-image'
import React from 'react'
import { ImageSourcePropType, StyleSheet, View, ViewStyle } from 'react-native'

import { AppBubbleText } from '@/components/AppBubbleText'

interface CharacterSpeaksProps {
  markup: string
  footer?: string | null
  orientation?: 'left' | 'right' | 'center'
  imageSize?: number
}

interface BaseProps extends CharacterSpeaksProps {
  imageSource: ImageSourcePropType
}

function CharacterSpeaks({
  markup,
  footer,
  orientation = 'left',
  imageSize = 80,
  imageSource,
}: BaseProps) {
  const isCenter = orientation === 'center'
  const isLeft = orientation === 'left'

  const alignment = isCenter ? 'center' : isLeft ? 'flex-start' : 'flex-end'

  const containerStyle: ViewStyle = {
    alignSelf: alignment,
    alignItems: isCenter ? 'center' : 'flex-end',
    flexDirection: isCenter ? 'column' : isLeft ? 'row' : 'row-reverse',
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={imageSource}
        style={{ width: imageSize, height: imageSize }}
        contentFit="contain"
      />
      <View style={styles.markupWrapper}>
        <AppBubbleText
          markup={markup}
          footer={footer}
          orientation={orientation}
        />
      </View>
    </View>
  )
}

export const MomoSpeaks = (props: CharacterSpeaksProps) => (
  <CharacterSpeaks
    orientation="left"
    {...props}
    imageSource={require('@/../assets/images/Momo.png')}
  />
)

export const MoaSpeaks = (props: CharacterSpeaksProps) => (
  <CharacterSpeaks
    orientation="right"
    {...props}
    imageSource={require('@/../assets/images/Moa.png')}
  />
)

export const SuSpeaks = (props: CharacterSpeaksProps) => (
  <CharacterSpeaks
    orientation="center"
    {...props}
    imageSource={require('@/../assets/images/Su-.png')}
  />
)

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  markupWrapper: {
    flexShrink: 1,
  },
})

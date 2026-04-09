import React from 'react'
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native'

import { AppMarkup } from '@/components/AppMarkup'

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
  const alignment =
    orientation === 'center'
      ? 'center'
      : orientation === 'left'
        ? 'flex-start'
        : 'flex-end'

  return (
    <View
      style={[
        styles.container,
        {
          alignSelf: alignment,
          alignItems: alignment,
        },
      ]}
    >
      <Image
        source={imageSource}
        style={{ width: imageSize, height: imageSize }}
        resizeMode="contain"
      />
      <AppMarkup markup={markup} footer={footer} orientation={orientation} />
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
})

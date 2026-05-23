import MaterialIcons from '@react-native-vector-icons/material-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { AppText } from '@/components/AppText'
import { COLORS } from '@/constants/constants'
import { ListItemType } from '@/types/list'

interface AppPictureCarouselProps {
  data: ListItemType[]
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
// SCREEN_WIDTH - 32 (AppScreen padding) - 4 (AppBox redLine width) - 32 (AppBox textWrapper padding)
const CAROUSEL_WIDTH = SCREEN_WIDTH - 68

export function AppPictureCarousel({ data }: AppPictureCarouselProps) {
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!data || data.length === 0) return null

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffset / CAROUSEL_WIDTH)
    if (index !== currentIndex && index >= 0 && index < data.length) {
      setCurrentIndex(index)
    }
  }

  const navigateTo = (index: number) => {
    if (index >= 0 && index < data.length) {
      scrollViewRef.current?.scrollTo({
        x: index * CAROUSEL_WIDTH,
        animated: true,
      })
      setCurrentIndex(index)
    }
  }

  const handlePressImage = (item: ListItemType) => {
    if (item.route) {
      router.push(item.route)
    }
  }

  const currentItem = data[currentIndex]
  const hasMultipleItems = data.length > 1
  const showLeftArrow = hasMultipleItems && currentIndex > 0
  const showRightArrow = hasMultipleItems && currentIndex < data.length - 1

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CAROUSEL_WIDTH}
        decelerationRate="fast"
        style={styles.scrollView}
      >
        {data.map(item => {
          const imageSource =
            typeof item.icon === 'string' ? { uri: item.icon } : item.icon
          return (
            <Pressable
              key={item.id}
              onPress={() => handlePressImage(item)}
              style={styles.imageContainer}
            >
              <Image
                source={imageSource}
                style={styles.image}
                contentFit="cover"
              />
            </Pressable>
          )
        })}
      </ScrollView>

      {showLeftArrow && (
        <Pressable
          onPress={() => navigateTo(currentIndex - 1)}
          style={[styles.arrowButton, styles.leftArrow]}
        >
          <MaterialIcons name="chevron-left" size={36} color={COLORS.TEXT} />
        </Pressable>
      )}

      {showRightArrow && (
        <Pressable
          onPress={() => navigateTo(currentIndex + 1)}
          style={[styles.arrowButton, styles.rightArrow]}
        >
          <MaterialIcons name="chevron-right" size={36} color={COLORS.TEXT} />
        </Pressable>
      )}
      <View style={styles.infoBarContainer}>
        {/* Placeholder spacer on left to balance the right-aligned duration for true center of label */}
        <View style={styles.sideSpacer} />
        <AppText style={styles.centeredLabel}>{'YouTube Video'}</AppText>
        <View style={styles.durationWrapper}>
          <AppText style={styles.durationLabel}>
            {currentItem?.line2 || ''}
          </AppText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  arrowButton: {
    alignItems: 'center',
    backgroundColor: COLORS.IMAGE_ARROW,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    zIndex: 10,
  },
  centeredLabel: {
    color: COLORS.SECONDARY,
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    borderRadius: 8,
    height: 232,
    marginVertical: 8,
    overflow: 'hidden',
    position: 'relative',
    width: CAROUSEL_WIDTH,
  },
  durationLabel: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    textAlign: 'right',
  },
  durationWrapper: {
    minWidth: 60,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    height: 200,
    width: CAROUSEL_WIDTH,
  },
  infoBarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 32,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  scrollView: {
    height: 200,
  },
  sideSpacer: {
    minWidth: 60,
  },
})

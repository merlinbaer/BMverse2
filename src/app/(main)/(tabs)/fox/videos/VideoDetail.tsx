import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { WebViewMessageEvent } from 'react-native-webview'
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe'

import { AppBox } from '@/components/AppBox'
import { AppInfoRow } from '@/components/AppInfoRow'
import { AppLoadScreen } from '@/components/AppLoadScreen'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { videoItem$ } from '@/services/legend'

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string
  }>()

  const playerRef = useRef<YoutubeIframeRef>(null)
  const navigation = useNavigation()

  const detail = useValue(videoItem$(id ?? ''))
  if (!id || !detail) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: 'YouTube Details' }} />
        <AppLoadScreen message="Video not found" />
      </AppScreen>
    )
  }

  const formattedDate = detail?.video_publishedat
    ? new Date(detail.video_publishedat)
        .toISOString()
        .replace('T', ' ')
        .substring(0, 16)
    : ''

  // Workaround for onFullScreenChange ios problem. But does not work
  const injectedJavaScript = `
		// Monitor changes in the fullscreen state of media elements
		document.addEventListener('fullscreenchange', function() {
		if (!document.fullscreenElement) {
			// If the document is no longer in fullscreen mode, notify React Native
			window.ReactNativeWebView.postMessage('exitFullScreen');
		}
		});

		// Also monitor if a video is paused, ended or resumed
		const videoElement = document.querySelector('video');
		if (videoElement) {
		videoElement.addEventListener('pause', () => {
			window.ReactNativeWebView.postMessage('videoPaused');
		});
		videoElement.addEventListener('play', () => {
			window.ReactNativeWebView.postMessage('videoPlaying');
		});
		videoElement.addEventListener('ended', () => {
			window.ReactNativeWebView.postMessage('videoEnded');
		});
		}
	`

  const handleStateChange = (state: string) => {
    // Close YouTube player when video ends
    console.log('VPlayer: ' + state)
    if (state === 'ended') {
      navigation.goBack()
    }
  }

  const handleFullScreenChange = (status: boolean) => {
    // does not work on IOS. See: https://github.com/LonelyCpp/react-native-youtube-iframe/issues/45
    // Closing of the Inline Media Player on IOS could not be detected, so the React native screen has to be closed manually,
    // after the full-screen end button (top left) of the Inline Media Player is pressed.
    // JavaScript injection and onMessage do not work either. It seems so that the events are fetched by youtube-iframe player
    console.log('handleFullScreenChange: ' + status)
  }

  const handleError = (error: string) => {
    console.log('youtube player error: ' + error)
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'YouTube Details' }} />
      <AppBox>
        <AppText fontSize={FONT.SIZE.BASE}>{detail?.video_title}</AppText>
        <View style={styles.ytContainer}>
          <YoutubePlayer
            ref={playerRef}
            height={200}
            width={370}
            videoId={detail?.video_id}
            onChangeState={handleStateChange}
            onFullScreenChange={handleFullScreenChange}
            onError={handleError}
            webViewProps={{
              allowsInlineMediaPlayback: false,
              injectedJavaScript: injectedJavaScript,
              onMessage: (event: WebViewMessageEvent) =>
                console.log(
                  'Injection and onMessage does not work:',
                  event.nativeEvent.data,
                ),
            }}
            play={true}
          />
        </View>
        <AppText fontSize={FONT.SIZE.SM} style={styles.durationText}>
          {detail?.video_duration}
        </AppText>
      </AppBox>
      <AppBox>
        <AppInfoRow label="PUBLISHED at:" value={formattedDate} />
        <AppInfoRow
          label="VIEW count:"
          value={Number(detail?.video_viewcount).toLocaleString()}
        />
        <AppInfoRow
          label="LIKE count:"
          value={Number(detail?.video_likecount).toLocaleString()}
        />
        <AppInfoRow
          label="COMMENT count:"
          value={Number(detail?.video_commentcount).toLocaleString()}
        />
      </AppBox>
      <AppBox>
        <AppText>{detail?.video_description}</AppText>
      </AppBox>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  durationText: {
    textAlign: 'right',
    width: '100%',
  },
  ytContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderRadius: 2,
    marginVertical: 16,
    overflow: 'hidden',
    width: '100%',
  },
})

import { setAudioModeAsync } from 'expo-audio'

// Configure global audio mode [[2]](https://docs.expo.dev/versions/latest/sdk/audio)
export const initAudioMode = () => {
  void setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'doNotMix',
  })
}

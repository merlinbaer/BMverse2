import { Platform } from 'react-native'

export async function registerServiceWorker() {
  if (
    Platform.OS !== 'web' ||
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator)
  ) {
    return
  }

  // Dynamic import to keep the bundle small and native-friendly
  const { Workbox } = await import('workbox-window')

  const wb = new Workbox('/sw.js')

  wb.addEventListener('installed', event => {
    if (event.isUpdate) {
      console.log('BMverse: New version available! Please refresh.')
    }
  })

  void wb.register()
}

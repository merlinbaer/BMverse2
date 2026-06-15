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

interface NavigatorStandalone extends Navigator {
  standalone?: boolean
}

/**
 * Detects if the app is running as a Progressive Web App (PWA)
 */
export function isPWA(): boolean {
  // 1. If we aren't on the web or are in a server-side environment, it's not a PWA
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false
  }

  // 2. Check the standard 'display-mode' media query (Android/Chrome)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  // 3. Check the Apple-specific property (iOS Safari)
  const isAppleStandalone =
    (navigator as NavigatorStandalone).standalone === true

  return isStandalone || isAppleStandalone
}

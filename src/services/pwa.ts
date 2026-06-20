import { Platform } from 'react-native'

/**
 * A promise that resolves when the Service Worker is fully active
 * and controlling the page.
 */
let swReadyResolve: (value: boolean) => void
export const isOfflineReady$ = new Promise<boolean>(resolve => {
  swReadyResolve = resolve
})

export async function registerServiceWorker() {
  if (
    Platform.OS !== 'web' ||
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator)
  ) {
    swReadyResolve(true) // Resolve immediately on non-web
    return
  }

  const { Workbox } = await import('workbox-window')
  const wb = new Workbox('/sw.js')

  // If there's already a controller, we are ready to intercept immediately
  if (navigator.serviceWorker.controller) {
    swReadyResolve(true)
  }

  // Handle first-time activation
  wb.addEventListener('activated', () => {
    console.log('BMverse: Offline engine activated.')
    swReadyResolve(true)
  })

  // Register the service worker
  try {
    const registration = await wb.register()
    if (registration) {
      console.log('BMverse: PWA Offline Support registered.')
    }
  } catch (error) {
    console.error('BMverse: SW Registration failed:', error)
    // Resolve anyway to prevent the app from hanging if registration fails
    swReadyResolve(true)
  }
}

interface NavigatorStandalone extends Navigator {
  standalone?: boolean
}

/**
 * Detects if the app is running as a Progressive Web App (PWA)
 */
export function isPWA(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isAppleStandalone =
    (navigator as NavigatorStandalone).standalone === true

  return isStandalone || isAppleStandalone
}

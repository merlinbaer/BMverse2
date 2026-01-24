import { Alert, AlertButton, Platform } from 'react-native'

export const useAlert = () => {
  const showAlert = (
    title: string,
    message?: string,
    options?: AlertButton[],
  ) => {
    if (Platform.OS === 'web') {
      // Wenn Optionen vorhanden sind, nutzen wir confirm/alert
      if (options && options.length > 0) {
        // Suche nach der primären Aktion (nicht "cancel")
        const primaryAction =
          options.find(opt => opt.style !== 'cancel') || options[0]
        const hasCancel = options.some(opt => opt.style === 'cancel')

        if (hasCancel) {
          // Confirmation-Dialog
          const confirmed = window.confirm(
            `${title}${message ? `\n\n${message}` : ''}`,
          )
          if (confirmed && primaryAction.onPress) {
            primaryAction.onPress()
          }
        } else {
          // Einfacher Hinweis
          window.alert(`${title}${message ? `\n\n${message}` : ''}`)
          if (primaryAction.onPress) primaryAction.onPress()
        }
      } else {
        window.alert(`${title}${message ? `\n\n${message}` : ''}`)
      }
    } else {
      // Mobile: Nutze natives Alert-Modul
      Alert.alert(title, message, options)
    }
  }

  return { showAlert }
}

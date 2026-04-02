import { Alert, AlertButton, Platform } from 'react-native'

// AI generated with Google Gemini 3 Flash
export const useAlert = () => {
  const showAlert = (
    title: string,
    message?: string,
    options?: AlertButton[],
  ) => {
    if (Platform.OS === 'web') {
      if (options && options.length > 0) {
        // Search for primary action (not "cancel")
        const primaryAction =
          options.find(opt => opt.style !== 'cancel') || options[0]
        const hasCancel = options.some(opt => opt.style === 'cancel')

        if (hasCancel) {
          // Confirmation-dialog
          const confirmed = window.confirm(
            `${title}${message ? `\n\n${message}` : ''}`,
          )
          if (confirmed && primaryAction.onPress) {
            primaryAction.onPress()
          }
        } else {
          // Simple dialog
          window.alert(`${title}${message ? `\n\n${message}` : ''}`)
          if (primaryAction.onPress) primaryAction.onPress()
        }
      } else {
        window.alert(`${title}${message ? `\n\n${message}` : ''}`)
      }
    } else {
      // Mobile use Alert-Modul
      Alert.alert(title, message, options)
    }
  }

  return { showAlert }
}

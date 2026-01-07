import { COLORS, FONT } from '@/constants/constants'
import { Platform, Pressable, StyleSheet, Text, ViewStyle } from 'react-native'

type AppButtonProps = {
  title: string
  onPress?: () => void
  disabled?: boolean
  style?: ViewStyle
}

export function AppButton({
  title,
  onPress,
  disabled = false,
  style,
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed, hovered }) => [
        styles.button,
        pressed && styles.pressed,
        hovered && Platform.OS === 'web' && styles.hovered,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center', // Layout Button fixed (always center)
    minWidth: 220, // Minimum width
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none', // Web
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  hovered: {
    backgroundColor: COLORS.BM_RED_HIGHLIGHTED,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.SM,
    fontWeight: FONT.WEIGHT.BASE,
    textTransform: 'uppercase',
  },
})

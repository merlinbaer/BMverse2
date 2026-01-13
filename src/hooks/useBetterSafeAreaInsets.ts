import { Dimensions } from 'react-native'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'

const dynamicBottomInset = (insets: EdgeInsets) => {
  const { height, width } = Dimensions.get('window')
  const screenMax = Math.max(height, width) // Portrait height?
  // small devices (e.g., 812 pt) - large devices (e.g., 932 pt)
  let bottomInset = insets.bottom
  if (bottomInset > 0) {
    // Dynamically adjust devices with Home Indicator
    const minInset = 20 // minimum distance
    const maxInset = 34 // standard on smaller iPhones
    const scale = 1.2 // scales how strongly it moves towards the min value
    // Linear interpolation between screenMax 812 → 34 and screenMax 932 → 28
    bottomInset = Math.trunc(
      Math.max(
        minInset,
        maxInset - ((screenMax - 812) / (932 - 812)) * (maxInset - 28) * scale,
      ),
    )
  }
  // If insets.bottom === 0, iPhone with Home Button remains unchanged
  return bottomInset
}

export function useBetterSafeAreaInsets() {
  const insets = useSafeAreaInsets()
  const newBottom = dynamicBottomInset(insets)
  const bottom = newBottom === 0 ? 0 : Math.round(newBottom / 2)
  const corner = bottom === 0 ? 0 : 15 // no rounded corners if inset.bottom === 0
  return {
    top: insets.top,
    bottom: bottom,
    left: insets.left,
    right: insets.right,
    corner: corner,
  }
}

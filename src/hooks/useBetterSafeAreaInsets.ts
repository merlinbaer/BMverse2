import { Dimensions } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

const dynamicBottomInset = (insets: EdgeInsets) => {
  const { height, width } = Dimensions.get('window');
  const screenMax = Math.max(height, width); // Portrait-Höhe?
  // kleine Geräte (z.B. 812 pt) - große Geräte (z.B. 932 pt)
  let bottomInset = insets.bottom;
  if (bottomInset > 0) {
    // Geräte mit Home Indicator dynamisch anpassen
    const minInset = 20; // minimaler Abstand
    const maxInset = 34; // Standard auf kleineren iPhones
    const scale = 1.2; // skaliert wie stark gegen den Min Wert gegangen wird
    // Lineare Interpolation zwischen screenMax 812 → 34 und screenMax 932 → 28
    bottomInset = Math.trunc(
      Math.max(minInset, maxInset - ((screenMax - 812) / (932 - 812)) * (maxInset - 28) * scale)
    );
  }
  // Wenn insets.bottom === 0 dann iPhone mit Home Button bleibt unverändert
  return bottomInset;
};

export function useBetterSafeAreaInsets() {
  const insets = useSafeAreaInsets();
  const newBottom = dynamicBottomInset(insets);
  const bottom = newBottom === 0 ? 0 : Math.round(newBottom / 2);
  const corner = bottom === 0 ? 0 : 15; // keine runden Ecken wenn inset.bottom === 0
  return {
    top: insets.top,
    bottom: bottom,
    left: insets.left,
    right: insets.right,
    corner: corner,
  };
}

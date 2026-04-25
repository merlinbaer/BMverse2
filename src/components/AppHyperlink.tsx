import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as WebBrowser from 'expo-web-browser'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { COLORS, FONT } from '@/constants/constants'

type TextHyperlinkProps = {
  description: string
  hyperlink: string | null
  type: string // 'intern' or 'extern
  color?: string
  size?: number
}

export const AppHyperlink = ({
  description,
  hyperlink,
  type,
  color = COLORS.TEXT,
  size = FONT.SIZE.SM,
}: TextHyperlinkProps) => {
  const handleOnPress = async (hyperlink: string) => {
    if (type === 'intern') {
      console.log('Hyperlink-i: ' + hyperlink)
      await WebBrowser.openBrowserAsync(hyperlink)
    } else {
      console.log('Hyperlink-e: ' + hyperlink)
      Linking.openURL(hyperlink).catch(err =>
        console.error('Hyperlink Error: ', err),
      )
    }
  }

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        style={{
          ...styles.hyperlinkText,
          color: color,
          fontSize: size,
        }}
      >
        {description}
      </Text>
      {hyperlink ? (
        <TouchableOpacity
          style={styles.iconContainer}
          activeOpacity={0.85}
          onPress={() => handleOnPress(hyperlink)}
        >
          {type === 'intern' ? (
            <MaterialIcons
              name={'open-in-browser'}
              size={size + 3}
              color={color}
            />
          ) : (
            <Feather name={'external-link'} size={size} color={color} />
          )}
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 1,
  },
  hyperlinkText: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.BASE,
    fontWeight: '400',
    maxWidth: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
  },
})

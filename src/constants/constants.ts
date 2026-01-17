import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { Platform } from 'react-native'
import appJson from '../../app.json'

export const APP_VERSION = appJson.expo.version
export const AUTH_STORAGE_KEY = 'sb-eu-bruu-bmverse2-app-auth-token'

export const COLORS = {
  PRIMARY: '#db1b1a',
  BACKGROUND: '#000',
  SCROLL_VIEW: '#e3dfd3',
  TEXT: '#fff',
  TEXT_MUTED: '#a4a09d',
  ICON: '#fff',
  MAXIMUM_TRACK_TINT_COLOR: '#a4a09d',
  MINIMUM_TRACK_TINT_COLOR: '#e3dfd3',
  BM_RED: '#db1b1a',
  BM_RED_HIGHLIGHTED: '#cb1111',
  BM_DARK_RED: '#5f0a06',
  BM_VERY_DARK_RED: '#310a03',
  MESSAGE_BUBBLE: '#202c33',
}

export const FONT = {
  SIZE: {
    XS: 12,
    SM: 16,
    BASE: 20,
    LG: 24,
  },
  WEIGHT: {
    BASE: '600',
  },
} as const

export const LAYOUT = {
  paddingHorizontal: 16,
  gap: 24,
}

export const LayoutScreenHeader: NativeStackNavigationOptions = Platform.select(
  {
    ios: {
      headerLargeTitle: true,
      headerLargeTitleStyle: {
        color: COLORS.TEXT,
      },
      headerTitleStyle: {
        color: COLORS.TEXT,
      },
      headerStyle: { backgroundColor: 'transparent' },
      headerLargeStyle: { backgroundColor: COLORS.BACKGROUND },
      headerTintColor: COLORS.TEXT,
      headerTransparent: true,
      headerBlurEffect: 'dark',
      headerBackButtonDisplayMode: 'minimal',
      contentStyle: { backgroundColor: COLORS.BACKGROUND },
    },
    android: {
      headerStyle: { backgroundColor: COLORS.BACKGROUND },
      headerTitleStyle: {
        fontSize: FONT.SIZE.LG + 12,
        color: COLORS.TEXT,
      },
      headerTintColor: COLORS.TEXT,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: COLORS.BACKGROUND },
    },
    web: {
      headerStyle: { backgroundColor: COLORS.BACKGROUND, height: 80 },
      headerTitleStyle: {
        fontSize: FONT.SIZE.LG + 12,
        color: COLORS.TEXT,
      },
      headerTintColor: COLORS.TEXT,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: COLORS.BACKGROUND },
    },
    default: {
      headerStyle: { backgroundColor: COLORS.BACKGROUND },
      headerTintColor: COLORS.TEXT,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: COLORS.BACKGROUND },
    },
  },
)

const createTabBarConstants = (posY: number) =>
  ({
    HEIGHT: 65,
    BLUR_INTENSITY: 95,
    ICON_IMAGE_SIZE: 80,
    ICON_IMAGE_POSY: posY - 5,
    ICON_MARGIN_TOP: 8,
    ICON_SIZE: 30,
    LABEL_POSY: posY - 24,
  }) as const

export const TAB_BAR = createTabBarConstants(0)

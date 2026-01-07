import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { Platform } from 'react-native'

export const COLORS = {
  PRIMARY: '#db1b1a',
  BACKGROUND: '#000',
  SCROLLVIEW: '#1b1b1b',
  TEXT: '#fff',
  TEXT_MUTED: '#a4a09d',
  ICON: '#fff',
  MAXIMUM_TRACK_TINT_COLOR: '#a4a09d',
  MINIMUM_TRACK_TINT_COLOR: '#e3dfd3',
  BM_RED: '#db1b1a',
  BM_RED_HIGHLIGHTED: '#cb1111',
  BM_DARK_RED: '#5f0a06',
  BM_VERY_DARK_RED: '#310a03',
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

export const LargeHeaderOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: COLORS.BACKGROUND, height: 80 },
  headerTitleStyle: {
    fontSize: FONT.SIZE.LG + 12,
    color: COLORS.TEXT,
  },
  headerTintColor: COLORS.TEXT,
  headerShadowVisible: false,
  headerTitleAlign: 'left',
}

export const LayoutScreenHeader: NativeStackNavigationOptions = Platform.select(
  {
    ios: {
      headerLargeTitle: true,
      headerLargeStyle: {
        backgroundColor: COLORS.BACKGROUND,
      },
      headerLargeTitleStyle: {
        color: COLORS.TEXT,
      },
      headerStyle: { backgroundColor: 'rgba(0,0,0,0.9)' },
      headerTintColor: COLORS.TEXT,
      headerTransparent: true,
      headerBlurEffect: 'prominent',
      headerShadowVisible: false,
      headerBackButtonDisplayMode: 'minimal',
    },
    android: {
      headerStyle: { backgroundColor: COLORS.BACKGROUND },
      headerTitleStyle: {
        fontSize: FONT.SIZE.LG + 12,
        color: COLORS.TEXT,
      },
      headerTintColor: COLORS.TEXT,
      headerShadowVisible: false,
    },
    web: {
      headerStyle: { backgroundColor: COLORS.BACKGROUND, height: 80 },
      headerTitleStyle: {
        fontSize: FONT.SIZE.LG + 12,
        color: COLORS.TEXT,
      },
      headerTintColor: COLORS.TEXT,
      headerShadowVisible: false,
    },
    default: {
      headerStyle: { backgroundColor: COLORS.BACKGROUND },
      headerTintColor: COLORS.TEXT,
      headerShadowVisible: false,
    },
  },
)

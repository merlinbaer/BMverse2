/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Add support for wasm files used by expo-sqlite on web
config.resolver.assetExts.push('wasm')

// Handle potential resolution issues with vector icons on web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    moduleName === '@react-native-vector-icons/get-image'
  ) {
    return {
      type: 'empty',
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config

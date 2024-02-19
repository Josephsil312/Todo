/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // Add 'lottie' to the assetExts array
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'lottie'],
  },
  assets: ['./assets/fonts'],
  // (Optional) Add custom assets here if needed
  // assets: [...defaultConfig.assets, /* Your custom assets paths */],
  // (Optional) Other Metro configurations if needed
  // ...otherConfigOptions,
};

module.exports = mergeConfig(defaultConfig, config);

// export const assets = ['./assets/fonts'];

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@navigations': './src/navigations',
          '@redux': './src/redux',
          '@screens': './src/screens',
          '@types': './src/types',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};

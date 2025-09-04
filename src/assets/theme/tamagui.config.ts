// import { createTamagui, createTokens, createTheme } from 'tamagui';
// import { colors } from './colors';

// const tokens = createTokens({
//   color: {
//     ...colors.light,
//   },
//   size: { 0: 0, true: 16 },
//   space: { 0: 0, true: 8 },
//   radius: { 0: 0, true: 8 },
//   zIndex: { 0: 0, 1: 1 },
// });

// const lightTheme = createTheme(colors.light);
// const darkTheme = createTheme(colors.dark);

// const config = createTamagui({
//   tokens,
//   themes: {
//     light: lightTheme,
//     dark: darkTheme,
//   },
// });

// export type AppTamaguiConfig = typeof config;

// declare module 'tamagui' {
//   interface TamaguiCustomConfig extends AppTamaguiConfig {}
// }

// export default config;

import { createTamagui, createTokens } from 'tamagui';
import { colors } from './colors';

// Minimal tokens just for Tamagui
const tokens = createTokens({
  color: { ...colors.light }, // tokens need at least color
  size: { 0: 0, true: 16 },
  space: { 0: 0, true: 8 },
  radius: { 0: 0, true: 8 },
  zIndex: { 0: 0, 1: 1 },
});

// Inline themes without createTheme
const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    light: {
      color: { ...colors.light },
    },
    dark: {
      color: { ...colors.dark },
    },
  },
});

export type AppTamaguiConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default tamaguiConfig;


const fontConfig = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300',
  },
  thin: {
    fontFamily: 'System',
    fontWeight: '100',
  },
};


import {
  MD3LightTheme as PaperLightTheme,
  MD3DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

export const LightTheme = {
  ...PaperLightTheme,
  ...NavigationLightTheme,
  dark: false,
  fonts: fontConfig,
  colors: {
    ...PaperLightTheme.colors,
    ...NavigationLightTheme.colors,
    primary: '#FBC02D',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E5E5E5',
    notification: '#FBC02D',
  },
};

export const DarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  dark: true,
  fonts: fontConfig,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: '#FBC02D',
    background: '#000000',
    card: '#1A1A1A',
    text: '#FFFFFF',
    border: '#333333',
    notification: '#FBC02D',
  },
};

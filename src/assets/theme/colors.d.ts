import '@react-navigation/native';
import { ColorValue } from 'react-native';

type Color = ColorValue;

export type Theme = {
  dark: boolean;
  colors: {
    [x: string]: ColorValue | undefined;
    primary: Color;
    lightyellow: Color;
    black: Color;
    white: Color;
    hoverColor: Color;
    skyBlue: Color;
    babyBlue: Color;
    iceBlue: Color;
    lightBlue: Color;
    pastelBlue: Color;
    midnightBlue: Color;
    navyBlue: Color;
    seconary: Color;
    third: Color;
    lightgray: Color;
    gray: Color;
    darkGray: Color;
    error: Color;
    google: Color;
    pink: Color;
    modelbg: Color;
    background: Color;
    text: Color;
    heromain: Color;
    green: Color;
    accepted: Color;
  };
};

declare module '@react-navigation/native' {
  export function useTheme(): Theme;
}

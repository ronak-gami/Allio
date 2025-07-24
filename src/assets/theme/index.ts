const common = Object.freeze({
  primary: '#FBC02D',
  lightyellow: '#FFF9C4',
  black: '#000000',
  white: '#FFFFFF',
  hoverColor: '#F2EADF',
  skyBlue: '#87CEEB',
  babyBlue: '#ADD8E6',
  iceBlue: '#B3E0F2',
  lightBlue: '#ADD8E6',
  pastelBlue: '#D0EFFF',
  midnightBlue: '#191970',
  navyBlue: '#000080',
  seconary: '#00BFFF',
  third: '#0076DF',
  lightgray: '#B5B5B5',
  gray: '#909090',
  darkGray: '#323232',
  error: '#F44336',
  google: '#FF4433',
  pink: '#FF69B4',
  modelbg: '#0000004d',
});

const colors = Object.freeze({
  light: {
    ...common,
    background: '#FFFFFF',
    text: '#000000',
  },
  dark: {
    ...common,
    background: '#121212',
    text: '#FFFFFF',
  },
});

export default colors;
export type AppColors = typeof common & {
  background: string;
  text: string;
};

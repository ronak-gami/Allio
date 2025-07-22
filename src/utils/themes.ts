import {COLORS} from './color';

export const getThemeColors = (isDarkMode: boolean) => ({
  background: isDarkMode ? COLORS.darkGray : COLORS.white,
  text: isDarkMode ? COLORS.white : COLORS.black,
  card: isDarkMode ? COLORS.gray : COLORS.pastelBlue,
  primary: COLORS.primary,
  error: COLORS.error,
  modelbg: COLORS.modelbg,
});

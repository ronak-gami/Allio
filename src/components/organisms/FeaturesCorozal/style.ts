import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { CARD_WIDTH } from '@utils/constant';
import { useMemo } from 'react';

// Step 1: Define a function to generate styles using the theme
const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    textone: {
      padding: scale(10),
      fontSize: scale(18),
      color: theme.colors.text,
    },
    container: {
      width: CARD_WIDTH, // if you have CARD_WIDTH imported

      backgroundColor: theme.colors.card,
    },
  });

// Step 2: Use a custom hook that memoizes styles based on theme
const useStyle = () => {
  const theme = useTheme();
  return useMemo(() => makeStyles(theme), [theme]);
};

export default useStyle;

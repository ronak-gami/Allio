import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../../../utils/color';
export const useStyle = () => {
  return StyleSheet.create({
    inputContainer: {
      width: '100%',
    },
    inputField: {
      fontFamily: 'WinkyRough-Regular',
      fontSize: scale(14),
      backgroundColor: COLORS.white,
    },
    labelStyle: {
      fontFamily: 'WinkyRough-Regular',
      fontSize: scale(14),
    },
    errorText: {
      color: COLORS.error,
      fontSize: scale(12),
    },
  });
};

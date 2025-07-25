import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    inputContainer: {
      width: '100%',
    },
    inputField: {
      fontFamily: '',
      fontSize: scale(14),
      backgroundColor: COLORS.white,
    },
    textInput: {
      fontFamily: 'WinkyRough-Regular',
      fontSize: scale(14),
      color: COLORS.black,
    },
    multiline: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    errorText: {
      color: COLORS.error,
      fontSize: scale(12),
    },
    icon: {
      width: scale(20),
      height: scale(20),
      tintColor: COLORS.black,
    },
    prefixIcon: {
      width: scale(18),
      height: scale(18),
      tintColor: COLORS.gray,
    },
  });
};

export default useStyle;

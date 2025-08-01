import { StyleSheet } from 'react-native';

import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    inputContainer: {
      width: '100%',
    },
    inputField: {
      fontFamily: '',
      fontSize: scale(14),
      backgroundColor: colors.white,
    },
    textInput: {
      fontFamily: 'WinkyRough-Regular',
      fontSize: scale(14),
      color: colors.black,
    },
    multiline: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    errorText: {
      color: colors.error,
      fontSize: scale(12),
    },
    icon: {
      width: scale(20),
      height: scale(20),
      tintColor: colors.black,
    },
    prefixIcon: {
      width: scale(18),
      height: scale(18),
      tintColor: colors.gray,
    },
  });
};

export default useStyle;

import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

import { COLORS } from '@utils/color';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      width: '100%',
    },
    input: {
      height: scale(40),
      borderColor: COLORS.gray,
      borderWidth: 1,
      borderRadius: scale(6),
      paddingHorizontal: scale(10),
      backgroundColor: COLORS.white,
      fontFamily: 'WinkyRough-Regular',
      fontSize: scale(14),
    },
    item: {
      padding: scale(10),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray,
      backgroundColor: COLORS.white,
    },
    itemText: {
      fontSize: scale(14),
      color: COLORS.darkGray,
      fontFamily: 'WinkyRough-Regular',
    },
    errorText: {
      marginBottom: scale(10),
      fontSize: scale(12),
      fontFamily: 'WinkyRough-Regular',
    },
  });
};

export default useStyle;

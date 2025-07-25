import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { width } from '../../utils/helper';
import { COLORS } from '../../utils/color';

export const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.primary,
    },
    animation: {
      width: width * 0.8,
      height: width * 0.8,
    },
    text: {
      fontSize: scale(40),
      fontFamily: 'Poppins-Bold',
      fontWeight: 'bold',
      color: COLORS.black,
    },
  });
};

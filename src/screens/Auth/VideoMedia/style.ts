import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../../../utils/color';

export const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: scale(16),
      fontWeight: 'bold',
      color: COLORS.black,
    },
  });
};

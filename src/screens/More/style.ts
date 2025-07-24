
import {COLORS} from '../../utils/color';
import { scale } from 'react-native-size-matters';
import {StyleSheet} from 'react-native';

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
    logoutButton:  {
        backgroundColor: COLORS.primary,
      },
  });
};

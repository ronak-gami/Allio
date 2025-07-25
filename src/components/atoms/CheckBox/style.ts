import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: scale(5),
    },
    circle: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      borderWidth: 1,
      borderColor: COLORS.gray,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(10),
    },
    selectedCircle: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    checkIcon: {
      width: scale(12),
      height: scale(12),
      tintColor: COLORS.white,
    },
    label: {
      fontSize: scale(14),
    },
  });
};

export default useStyle;

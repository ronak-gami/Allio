import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: scale(6),
    },
    circle: {
      height: scale(20),
      width: scale(20),
      borderRadius: scale(10),
      borderWidth: 2,
      borderColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(10),
    },
    selectedCircle: {
      borderColor: COLORS.seconary,
    },
    innerCircle: {
      height: scale(10),
      width: scale(10),
      borderRadius: scale(5),
      backgroundColor: COLORS.primary,
    },
    label: {
      fontSize: scale(14),
      color: COLORS.darkGray,
    },
    errorText: {
      marginTop: scale(4),
      color: COLORS.error,
      fontSize: scale(12),
    },
  });
};

export default useStyle;

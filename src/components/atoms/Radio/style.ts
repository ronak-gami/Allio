import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
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
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(10),
    },
    selectedCircle: {
      borderColor: colors.seconary,
    },
    innerCircle: {
      height: scale(10),
      width: scale(10),
      borderRadius: scale(5),
      backgroundColor: colors.primary,
    },
    label: {
      fontSize: scale(14),
      color: colors.darkGray,
    },
    errorText: {
      marginTop: scale(4),
      color: colors.error,
      fontSize: scale(12),
    },
  });
};

export default useStyle;

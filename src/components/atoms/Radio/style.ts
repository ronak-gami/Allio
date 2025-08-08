import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: scale(10),
    },
    circle: {
      height: scale(20),
      width: scale(20),
      borderRadius: scale(10),
      borderWidth: 2,
      borderColor: colors.black,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(10),
    },
    selectedCircle: {
      borderColor: colors.black,
    },
    innerCircle: {
      height: scale(10),
      width: scale(10),
      borderRadius: scale(5),
      backgroundColor: colors.primary,
    },
    label: {
      fontSize: scale(20),
      color: colors.black,
    },
    errorText: {
      marginTop: scale(4),
      color: colors.error,
      fontSize: scale(12),
    },
  });
};

export default useStyle;

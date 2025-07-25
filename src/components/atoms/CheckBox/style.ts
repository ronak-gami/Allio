import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: scale(5),
    },
    circle: {
      width: scale(18),
      height: scale(18),
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.gray,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(8),
    },
    selectedCircle: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkIcon: {
      width: scale(12),
      height: scale(12),
      tintColor: colors.white,
    },
    label: {
      fontSize: scale(16),
    },
  });
};

export default useStyle;

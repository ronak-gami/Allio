import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    button: {
      marginHorizontal: scale(8),
      borderRadius: scale(20),
      padding: scale(6),
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    pressed: {
      backgroundColor: colors.hoverColor,
      opacity: 0.8,
    },
    icon: {
      width: scale(32),
      height: scale(32),
      resizeMode: 'contain',
    },
  });
};

export default useStyle;

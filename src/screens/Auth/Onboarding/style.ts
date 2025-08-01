import { StyleSheet } from 'react-native';

import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: scale(10),
      paddingHorizontal: 24,
      borderRadius: 8,
      position: 'absolute',
      bottom: 50,
      marginLeft: 30,
      alignSelf: 'flex-start',
    },
    buttonText: {
      color: colors.white,
      fontSize: 18,
    },
    skipButton: {
      position: 'absolute',
      bottom: 50,
      right: 40,
      zIndex: 1,
      padding: 10,
    },
    skipText: {
      color: colors.primary,
      fontSize: 16,
    },
  });
};

export default useStyle;

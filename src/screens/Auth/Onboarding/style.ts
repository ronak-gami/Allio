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
      paddingHorizontal: scale(24),
      borderRadius: 8,
      position: 'absolute',
      bottom: scale(35),
      marginLeft: scale(25),
      alignSelf: 'flex-start',
    },
    buttonText: {
      color: colors.white,
      fontSize: scale(16),
    },
    skipButton: {
      position: 'absolute',
      bottom: scale(40),
      right: scale(40),
      zIndex: 1,
      padding: 10,
    },
    skipText: {
      color: colors.primary,
      fontSize: scale(16),
    },
    statusBar: {
      backgroundColor: colors.lightyellow,
    },
  });
};

export default useStyle;

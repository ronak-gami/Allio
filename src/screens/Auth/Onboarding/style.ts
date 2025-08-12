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

    skipButton: {
      position: 'absolute',
      top: scale(10),
      right: scale(10),
      zIndex: 1,
      padding: 10,
    },
    skipText: {
      color: colors.primary,
      fontSize: scale(22),
    },
    statusBar: {
      backgroundColor: colors.lightyellow,
    },

    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: scale(20),
      position: 'absolute',
      bottom: scale(20),
    },
    navButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: scale(20),
      paddingVertical: scale(10),
      borderRadius: 8,
    },

    icon: {
      width: scale(18),
      height: scale(18),
      tintColor: colors.white,
      marginHorizontal: 5,
    },
    buttonText: {
      fontSize: scale(14),
      color: colors.white,
    },
  });
};

export default useStyle;

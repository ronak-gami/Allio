import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
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

      fontWeight: 'bold',
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
      fontWeight: '600',
    },
  });
};

export default useStyle;

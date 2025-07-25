import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    button: {
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      position: 'absolute',
      bottom: 50,
      marginLeft:30,
      alignSelf: 'flex-start',
    },
    buttonText: {
      color: COLORS.white,
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
      color: COLORS.primary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
};

export default useStyle;

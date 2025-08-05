import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    card: {
      justifyContent: 'center',

      backgroundColor: colors.lightyellow,
      borderRadius: scale(16),
      padding: scale(16),
      alignItems: 'center',
      marginHorizontal: scale(40),
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 2,
      width: width * 0.7,
    },
    image: {
      width: width * 0.5,
      height: height * 0.15,
      marginBottom: scale(8),
    },
    title: {
      fontSize: scale(18),
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: scale(4),
      textAlign: 'center',
    },
    description: {
      fontSize: scale(14),
      color: colors.text,
      marginBottom: scale(8),
      textAlign: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: scale(8),
      paddingVertical: scale(8),
      paddingHorizontal: scale(24),
      marginTop: scale(8),
    },

    buttonText: {
      color: colors.lightyellow,
      fontSize: scale(16),
      textAlign: 'center',
    },
  });
};

export default useStyle;

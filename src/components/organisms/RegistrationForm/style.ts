import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    formContainer: {
      flex: 1,
      gap: scale(10),
    },
    title: {
      fontSize: scale(24),
      fontWeight: 'bold',
      color: COLORS.primary,
      textAlign: 'center',
    },
    loginText: {
      paddingVertical: scale(20),
      fontSize: scale(18),
      textAlign: 'center',
      color: COLORS.gray,
    },
    loginLink: {
      fontSize: scale(18),
      color: COLORS.primary,
      fontWeight: 'bold',
      textAlign: 'justify',
    },
    loginButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: scale(12),
    },
    subtitle: {
      fontSize: scale(16),
      color: COLORS.black,
      textAlign: 'center',
    },
  });
};

export default useStyle;

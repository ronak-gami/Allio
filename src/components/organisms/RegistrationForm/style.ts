import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    formContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: scale(16),
      backgroundColor: colors.white,
    },
    title: {
      fontSize: scale(34),
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'left',
    },
    subtitle: {
      fontSize: scale(16),
      color: colors.black,
      textAlign: 'left',
      marginBottom: scale(30),
    },
    loginText: {
      paddingVertical: scale(20),
      fontSize: scale(18),
      textAlign: 'center',
      color: colors.gray,
    },
    loginLink: {
      fontSize: scale(18),
      color: colors.primary,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    loginButton: {
      backgroundColor: colors.primary,
      paddingVertical: scale(12),
    },
    inputContainer: {
      marginBottom: scale(10),
      gap: scale(10),
    },
  });
};

export default useStyle;

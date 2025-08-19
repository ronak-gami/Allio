import { StyleSheet } from 'react-native';

import { useTheme } from '@react-navigation/native';
import { height, width } from '@utils/helper';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    formContainer: {
      justifyContent: 'center',
      paddingHorizontal: scale(10),
      paddingVertical: width * 0.11,
    },
    title: {
      fontSize: scale(34),
      color: colors.primary,
    },
    subtitle: {
      fontSize: scale(16),
      color: colors.text,
      textAlign: 'left',
      marginBottom: scale(30),
    },
    loginText: {
      color: colors.primary,
      fontSize: scale(16),
    },
    loginLink: {
      fontSize: scale(18),
      color: colors.primary,
      textAlign: 'center',
    },
    registerButton: {
      marginVertical: scale(6),
      backgroundColor: colors.primary,
      paddingVertical: height * 0.02,
    },
    inputContainer: {
      marginBottom: scale(10),
      gap: scale(10),
    },
    dividerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: scale(20),
      alignItems: 'center',
      gap: 3,
    },
    orText: {
      color: colors.text,
      fontSize: scale(16),
    },

    socialSignInText: {
      fontSize: scale(16),
      color: colors.primary,
      textAlign: 'center',
      marginVertical: scale(10),
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.text,
    },
    SocialButtonStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 12,
    },
  });
};

export default useStyle;

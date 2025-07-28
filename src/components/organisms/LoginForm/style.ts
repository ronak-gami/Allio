import { useTheme } from '@react-navigation/native';
import { height } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    logoContainer: {
      alignItems: 'center',
      marginBottom: scale(5),
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
    formContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: scale(16),
    },
    logo: {
      width: scale(200),
      height: scale(200),
      resizeMode: 'contain',
    },
    dividerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 3,
    },
    socialSignInText: {
      fontSize: scale(16),
      color: colors.primary,
      textAlign: 'center',
      marginVertical: scale(10),
    },
    emailInput: {
      marginBottom: scale(12),
      borderRadius: scale(8),
      paddingHorizontal: scale(12),
    },
    inputContainer: {
      marginBottom: scale(10),
      gap: scale(10),
    },

    button: {
      marginVertical: scale(6),
    },
    loginButton: {
      marginVertical: scale(6),
      backgroundColor: colors.primary,
      paddingVertical: height * 0.02,
    },
    socialButtonsWrapper: {
      marginTop: scale(12),
    },
    iconStyle: {
      width: scale(18),
      height: scale(18),
      resizeMode: 'contain',
    },

    dividerText: {
      // paddingHorizontal: scale(15),
      color: colors.primary,
      fontSize: scale(16),
      justifyContent: 'center',
      textAlign: 'center',
    },
    orText: {
      color: colors.text,
      fontSize: scale(16),
    },
    signUpText: {
      color: colors.primary,
      fontSize: scale(16),
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: scale(20),
      paddingHorizontal: scale(40),
    },
    icon: {
      width: scale(32),
      height: scale(32),
      resizeMode: 'contain',
    },
    SocialButtonStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 12,
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
      textAlign: 'center',
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.text,
    },
  });
};
export default useStyle;

import { useTheme } from '@react-navigation/native';
import { height } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      marginHorizontal: height * 0.02,
    },
    subView: { flexGrow: 1 },
    form: {
      flex: 1,
      gap: scale(5),
    },
    title: {
      fontSize: scale(34),
      color: colors.primary,
    },

    subtitle: {
      fontSize: scale(16),
      color: colors.text,
      marginBottom: scale(15),
    },
    forgotpassText: {
      color: colors.text,
      fontSize: scale(16),
      textAlign: 'right',
    },
    loginButton: {
      marginTop: scale(16),
      marginVertical: scale(6),
      backgroundColor: colors.primary,
      borderRadius: scale(8),
      paddingVertical: scale(12),
    },
    dividerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: scale(20),
      alignItems: 'center',
      gap: 3,
    },
    otpLabel: {
      fontSize: scale(25),
    },
    buttonGrow: {
      flexGrow: 1,
    },
    otpInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textResetotp: {
      textAlign: 'center',
      marginTop: 10,
      fontSize: scale(15),
    },
    button: { marginBottom: height * 0.02 },
  });
};
export default useStyle;

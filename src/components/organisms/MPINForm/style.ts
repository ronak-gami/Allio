import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

import { height } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      marginHorizontal: height * 0.02,
    },
    subView: { flexGrow: 1 },
    title: {
      fontSize: scale(34),
      color: colors.primary,
    },
    subtitle: {
      fontSize: scale(16),
      color: colors.text,
      textAlign: 'left',
      marginBottom: scale(10),
    },
    otpContainer: {
      marginVertical: scale(10),
      justifyContent: 'space-between',
    },
    otpInput: {
      borderRadius: scale(10),
      borderWidth: 1,
      width: scale(50),
      height: scale(50),
      textAlign: 'center',
      fontSize: scale(18),
    },
    errorText: {
      color: 'red',
      alignSelf: 'flex-end',
      fontSize: scale(14),
    },
    button: { marginBottom: height * 0.02 },
    forgotpassText: {
      color: colors.text,
      fontSize: scale(16),
      textAlign: 'right',
    },
  });
};
export default useStyle;

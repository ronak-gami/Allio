import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    rememberForgotView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    forgotpassText: {
      color: colors.black,
      fontSize: scale(16),
    },
  });
};
export default useStyle;

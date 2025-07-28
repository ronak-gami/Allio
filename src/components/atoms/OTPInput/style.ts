import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

export const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    wrapper: {
      marginVertical: scale(10),
    },
    label: {
      fontSize: scale(14),
      color: colors.text,
      marginBottom: scale(6),
    },
    otpContainer: {
      width: '100%',
      gap: scale(15),
    },
    otpBox: {
      borderRadius: scale(10),
      borderWidth: 1,
      borderColor: colors.primary,
      width: scale(50),
      height: scale(50),
      fontSize: scale(18),
      color: colors.text,
    },
  });
};

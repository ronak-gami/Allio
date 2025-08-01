import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    modalContent: {
      maxHeight: height * 0.5,
    },
    successMessage: {
      backgroundColor: colors.card,
      borderRadius: width * 0.02,
    },
    successText: {
      fontSize: scale(14),
      color: colors.primary,
      textAlign: 'center',
      lineHeight: scale(20),
    },
  });
};

export default useStyle;

import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      color: colors.black,
    },
  });
};

export default useStyle;

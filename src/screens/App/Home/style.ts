import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
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

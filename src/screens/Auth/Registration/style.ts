import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    ScrollingStyle: {
      justifyContent: 'center',
    },
  });
};
export default useStyle;

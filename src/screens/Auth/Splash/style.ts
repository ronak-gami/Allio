import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
  });
};
export default useStyle;

import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(16),
      justifyContent: 'center',
    },
    title: {
      fontSize: scale(22),
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.text,
    },
    btn: {
      marginVertical: scale(10),
    },
  });
};
export default useStyle;

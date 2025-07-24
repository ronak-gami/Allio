import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.black,
    },
  });
};
export default useStyle;

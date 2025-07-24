import { StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/color';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.primary,
    },
  });
};
export default useStyle;

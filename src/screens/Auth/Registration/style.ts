import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(10),
      paddingVertical: scale(20),
      backgroundColor: COLORS.white,
    },
    ScrollingStyle: {
      flexGrow: 1,
    },
  });
};
export default useStyle;
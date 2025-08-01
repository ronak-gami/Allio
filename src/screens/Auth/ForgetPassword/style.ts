import { StyleSheet } from 'react-native';

import { useTheme } from '@react-navigation/native';
import { width } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingVertical: width * 0.25,
    },
    contentContainer: {
      justifyContent: 'center',
    },
  });
};
export default useStyle;

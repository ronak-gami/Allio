import { StyleSheet } from 'react-native';

import { useTheme } from '@react-navigation/native';
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
    statusBar: {
      backgroundColor: colors.white,
    },
  });
};
export default useStyle;

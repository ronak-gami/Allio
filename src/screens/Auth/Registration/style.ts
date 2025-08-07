import { StyleSheet } from 'react-native';

import { useTheme } from '@react-navigation/native';
const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    ScrollingStyle: {
      justifyContent: 'center',
    },
    statusBar: {
      backgroundColor: colors.white,
    },
  });
};
export default useStyle;

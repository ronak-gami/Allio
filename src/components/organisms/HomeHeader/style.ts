import { StyleSheet } from 'react-native';

import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    logoStyle: {
      width: scale(100),
      height: scale(40),
    },
    logoContainer: {
      marginLeft: scale(10),
    },
  });
};
export default useStyle;

import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () =>
  StyleSheet.create({
    tabIcon: {
      height: scale(24),
      width: scale(24),
      marginTop: scale(5),
    },
    tabLabel: {
      fontSize: scale(12),
      marginTop: 5,
    },
  });

export default useStyle;

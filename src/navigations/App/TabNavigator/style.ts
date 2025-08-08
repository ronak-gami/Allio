import { width } from '@utils/helper';
import { StyleSheet } from 'react-native';

const useStyle = () =>
  StyleSheet.create({
    tabIcon: {
      width: width * 0.07,
      height: width * 0.07,
    },
  });

export default useStyle;

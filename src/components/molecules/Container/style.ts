import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
    },
  });
};

export default useStyle;

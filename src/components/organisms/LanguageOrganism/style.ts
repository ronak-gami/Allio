import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      marginTop: scale(20),
    },
  });
};

export default useStyle;

import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    buttonContainer: {
      position: 'absolute',
      bottom: scale(20),
      left: scale(20),
      right: scale(20),
    },
  });
};

export default useStyle;

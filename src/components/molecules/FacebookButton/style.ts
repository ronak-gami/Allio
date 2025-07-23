import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  iconStyle: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
  },
  button: {
    marginVertical: scale(6),
  },
});

export default styles;

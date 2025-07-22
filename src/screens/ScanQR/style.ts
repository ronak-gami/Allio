import {StyleSheet} from 'react-native';
import {COLORS} from '../../utils/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
});

export default styles;

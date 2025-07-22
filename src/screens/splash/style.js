import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../utils/color';
import {width} from '../../utils/helper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  animation: {
    width: width * 0.8,
    height: width * 0.8,
  },
  text: {
    fontSize: scale(40),
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    color: COLORS.black,
  },
});

export default styles;

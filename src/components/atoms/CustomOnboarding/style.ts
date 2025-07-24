import { COLORS } from '@utils/color';
import { height, width } from '@utils/helper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightyellow,
    justifyContent: 'center',
    paddingHorizontal: 38,
  },
  image: {
    width: width * 0.8,
    height: height * 0.5,
    resizeMode: 'contain',
    alignItems: 'center',
    borderRadius: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20,
    color: COLORS.black,
  },
  description: {
    fontSize: 18,
    textAlign: 'left',
    width: '50%',
    marginTop: 10,
    color: COLORS.black,
  },
});

export default styles;

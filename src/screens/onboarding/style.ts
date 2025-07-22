import {StyleSheet} from 'react-native';
import {COLORS} from '../../utils/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#0076DF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;

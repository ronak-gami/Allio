import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../../utils/color';
import {height, width} from '../../../utils/helper';


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    paddingTop: scale(80),
  },
  backButton: {
    position: 'absolute',
    top: scale(40),
    left: scale(20),
    zIndex: 1,
  },
  form: {
    gap: scale(20),
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    textAlign: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  subtitle: {
    fontSize: scale(16),
    textAlign: 'center',
    color: COLORS.gray,
  },

  loginButton: {
    marginTop: scale(16),
    marginVertical: scale(6),
    backgroundColor: COLORS.primary,
    borderRadius: scale(8),
    paddingVertical: scale(12),
  },
});

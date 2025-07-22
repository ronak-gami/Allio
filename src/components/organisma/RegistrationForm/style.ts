import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../../utils/color';
import {height, width} from '../../../utils/helper';

export default StyleSheet.create({
  formContainer: {
    borderRadius: scale(8),
    backgroundColor: COLORS.white,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    marginTop: scale(12),
    padding: scale(16),
    borderRadius: scale(8),
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: scale(20),
  },
  loginText: {
    marginTop: scale(20),
    fontSize: scale(14),
    textAlign: 'center',
    color: COLORS.gray,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: scale(16),
    marginVertical: scale(6),
    backgroundColor: COLORS.primary,
    borderRadius: scale(8),
    paddingVertical: scale(12),
  },
  form: {
    justifyContent: 'center',
    marginTop: scale(12),
    gap: scale(10),

    borderRadius: scale(8),
    backgroundColor: COLORS.white,
  },
  subtitle: {
    fontSize: scale(16),
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: scale(30),
  },
});

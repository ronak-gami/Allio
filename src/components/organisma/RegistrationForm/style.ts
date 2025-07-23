import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../../utils/color';

export default StyleSheet.create({
  formContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  container: {
    justifyContent: 'center',
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
    fontSize: scale(18),
    textAlign: 'center',
    color: COLORS.gray,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  loginButton: {
    marginVertical: scale(6),
    backgroundColor: COLORS.primary,
    paddingVertical: scale(12),
    marginTop: scale(16),
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

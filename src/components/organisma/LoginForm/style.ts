import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../../utils/color';

export default StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: scale(5),
  },
  title: {
    fontSize: scale(34),
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: scale(20),
  },
  subtitle: {
    fontSize: scale(16),
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: scale(30),
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: scale(16),
    backgroundColor: COLORS.white,
  },
  logo: {
    width: scale(200),
    height: scale(200),
    resizeMode: 'contain',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: scale(12),
  },

  emailInput: {
    marginBottom: scale(12),
    // backgroundColor: COLORS.lightGray,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
  },
  inputContainer: {
    marginBottom: scale(10),
    gap: scale(10),
    // backgroundColor: COLORS.lightGray,
  },

  button: {
    marginVertical: scale(6),
  },
  loginButton: {
    marginVertical: scale(6),
    backgroundColor: COLORS.primary,
  },
  socialButtonsWrapper: {
    marginTop: scale(12),
  },
  iconStyle: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
  },

  dividerText: {
    // paddingHorizontal: scale(15),
    color: COLORS.primary,
    fontSize: scale(16),
    justifyContent: 'center',
    textAlign: 'center',
  },
  orText: {
    color: COLORS.primary,
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  signUpText: {
    color: COLORS.primary,
    fontSize: scale(16),
    fontWeight: 'bold',
  },
});

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
    flex: 1,
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
    justifyContent: 'center',
    marginTop: scale(20),
    alignItems: 'center',
    // marginVertical: scale(12),
  },
  socialSignInText: {
    fontSize: scale(16),
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: scale(10),
  },
  emailInput: {
    marginBottom: scale(12),
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
    paddingVertical: scale(12),
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(20),
    paddingHorizontal: scale(40),
  },
  icon: {
    width: scale(32),
    height: scale(32),
    resizeMode: 'contain',
  },
});

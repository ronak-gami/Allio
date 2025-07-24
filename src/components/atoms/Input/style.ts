import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  inputField: {
    fontFamily: '',
    fontSize: scale(14),
    backgroundColor: COLORS.white,
  },
  textInput: {
    fontFamily: 'WinkyRough-Regular',
    fontSize: scale(14),
    color: COLORS.error,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: COLORS.error,
    fontSize: scale(12),
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: COLORS.black,
  },
  prefixIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
  },
});

export default styles;

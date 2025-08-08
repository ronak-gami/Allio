import { scale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { COLORS } from './color';
import { FONTS } from '@assets/index';

export const showSuccess = (message: string): void => {
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: message,
    position: 'bottom',
    visibilityTime: 5000,
    autoHide: true,
    text1Style: {
      fontSize: scale(16),
      color: COLORS.green,
      fontFamily: FONTS.semiBold,
    },
    text2Style: {
      fontSize: scale(14),
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
  });
};

export const showError = (message: string): void => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
    position: 'bottom',
    visibilityTime: 5000,
    autoHide: true,
    text1Style: {
      fontSize: scale(16),
      color: COLORS.error,
      fontFamily: FONTS.semiBold,
    },
    text2Style: {
      fontSize: scale(14),
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
  });
};

export const showInfo = (message: string): void => {
  Toast.show({
    type: 'info',
    text1: 'Info',
    text2: message,
    position: 'bottom',
    visibilityTime: 5000,
    autoHide: true,
    text1Style: {
      fontSize: scale(16),
      color: COLORS.lightBlue,
      fontFamily: FONTS.semiBold,
    },
    text2Style: {
      fontSize: scale(14),
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
  });
};

export const showWarning = (message: string): void => {
  Toast.show({
    type: 'info',
    text1: 'Warning',
    text2: message,
    position: 'bottom',
    visibilityTime: 5000,
    autoHide: true,
    text1Style: {
      fontSize: scale(16),
      color: COLORS.lightyellow,
      fontFamily: FONTS.semiBold,
    },
    text2Style: {
      fontSize: scale(14),
      color: COLORS.black,
      fontFamily: FONTS.regular,
    },
  });
};

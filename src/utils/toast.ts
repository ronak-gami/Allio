import { Toast } from 'toastify-react-native';

export const showSuccess = (message: string): void => {
  Toast.show({
    type: 'success',
    text1: message,
    visibilityTime: 5000,
  });
};

export const showError = (message: string): void => {
  Toast.show({
    type: 'error',
    text1: message,
    visibilityTime: 5000,
  });
};

export const showInfo = (message: string): void => {
  Toast.show({
    type: 'info',
    text1: message,
    visibilityTime: 5000,
  });
};

export const showWarning = (message: string): void => {
  Toast.show({
    type: 'warn',
    text1: message,
    visibilityTime: 5000,
  });
};

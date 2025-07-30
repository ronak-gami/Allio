import { store } from '@redux/store';
import { biometricStateChange } from '../redux/slices/BiometricSlice';
import ReactNativeBiometrics from 'react-native-biometrics';

export const promptAppLock = async (): Promise<boolean> => {
  const rn = new ReactNativeBiometrics();
  try {
    const { available, biometryType } = await rn.isSensorAvailable();
    console.log('Biometry type:', biometryType);
    if (!available) {
      throw new Error('No biometric available');
    }

    const { success } = await rn.simplePrompt({
      promptMessage: 'Unlock App',
      cancelButtonText: 'cancel',
      fallbackPromptMessage: '',
    });

    store.dispatch(biometricStateChange(success));
    return success;
  } catch (err) {
    console.warn('Biometric auth failed:', err);
    store.dispatch(biometricStateChange(false));
    return false;
  }
};

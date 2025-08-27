import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  signInWithEmailAndPassword,
  getAuth,
} from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';

import { setStateKey } from '@redux/slices/AuthSlice';
import { checkUserExistsByEmail } from '@utils/helper';
import { showError, showSuccess } from '@utils/toast';
import useValidation from '@utils/validationSchema';
import { AUTH } from '@utils/constant';
import { AuthNavigationProp } from '@types/navigations';

export const useLoginForm = () => {
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthNavigationProp>();
  const { loginValidationSchema } = useValidation();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = async (values: typeof initialValues) => {
    setLoading(true);
    const trace = perf().newTrace('login_flow');
    await trace.start();

    try {
      const email = values.email.trim().toLowerCase();
      const password = values.password.trim();

      const exists = await checkUserExistsByEmail(email);
      if (!exists) {
        showError('User does not exist!');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );

      // Dispatch user data (use normalized email)
      dispatch(setStateKey({ key: 'userData', value: { ...values, email } }));

      const user = userCredential.user;
      if (user) {
        const token = await user.getIdToken();
        dispatch(setStateKey({ key: 'token', value: token }));

        // Handle FCM Token
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          await firestore().collection('users').doc(user.uid).set(
            {
              fcmToken,
              fcmUpdatedAt: firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
        } else {
          console.warn('FCM token not available after login.');
        }

        // Analytics & Crashlytics
        await analytics().logEvent('login', { method: 'email', email });
        crashlytics().log('User login successful');
        crashlytics().setAttribute('email', email);

        showSuccess('Login Successful!');
        await requestUserPermission();
      }
    } catch (error) {
      console.error('Error into handleLogin :- ', error);
      crashlytics().recordError(error as Error);
      crashlytics().log('Error during login');

      showError(
        (error as any)?.response?.data?.message ||
          'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
      await trace.stop();
    }
  };

  const navigateToRegister = () => {
    navigation.push(AUTH.Register);
  };

  return {
    remember,
    setRemember: () => setRemember(prev => !prev),
    loading,
    handleLogin,
    initialValues,
    loginValidationSchema,
    navigateToRegister,
  };
};

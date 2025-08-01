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

import { setStateKey, logout as reduxLogout } from '@redux/slices/AuthSlice';
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

  const removeDeviceToken = async (userId: string, token: string) => {
    if (!userId || !token) {
      console.warn('Cannot remove device token: userId or token is missing.');
      return;
    }
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('deviceTokens')
        .doc(token)
        .delete();
      console.log('FCM token removed successfully for user:', userId);
    } catch (error) {
      console.error('Error removing FCM token:', error);
      crashlytics().recordError(error as Error);
    }
  };

  const handleLogin = async (values: typeof initialValues) => {
    setLoading(true);
    const trace = perf().newTrace('login_flow');
    await trace.start();

    try {
      const exists = await checkUserExistsByEmail(values.email);
      if (!exists) {
        showError('User does not exist!');
        return;
      }
      const auth = getAuth();

      console.log('Signing in user', values.email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      console.log('Sign in result', userCredential);

      dispatch(setStateKey({ key: 'userData', value: values }));

      const user = userCredential.user;
      if (user) {
        const token = await user.getIdToken();
        dispatch(setStateKey({ key: 'token', value: token }));

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

        await analytics().logEvent('login', {
          method: 'email',
          email: values.email,
        });

        crashlytics().log('User login successful');
        crashlytics().setAttribute('email', values.email);
        showSuccess('Login Successful!');
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

  const handleLogout = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Get current FCM token before signing out
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          await removeDeviceToken(currentUser.uid, fcmToken);
          console.log('token remove successfully');
        } else {
          console.warn('FCM token not available during logout.');
        }

        await auth.signOut();
        dispatch(reduxLogout());
      }
    } catch (error) {
      console.error('Error during logout:', error);
      crashlytics().recordError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate(AUTH.Register);
  };

  return {
    remember,
    setRemember: () => setRemember(prev => !prev),
    loading,
    handleLogin,
    handleLogout,
    initialValues,
    loginValidationSchema,
    navigateToRegister,
  };
};

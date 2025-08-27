import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  signInWithEmailAndPassword,
  getAuth,
} from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
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
    const trace = await perf().startTrace('login');
    setLoading(true);

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

      const user = userCredential.user;

      if (user) {
        const idToken = await user.getIdToken();
        dispatch(setStateKey({ key: 'token', value: idToken }));

        const userDocRef = firestore().collection('users').doc(user.uid);
        const userDoc = await userDocRef.get();
        const userData = userDoc.data();

        // Store only essential user data
        const essentialUserData = {
          email: userData?.email || email,
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          mobileNo: userData?.mobileNo || '',
          profileImage: userData?.profileImage || '',
        };

        dispatch(setStateKey({ key: 'userData', value: essentialUserData }));

        // Analytics & Crashlytics
        await analytics().logEvent('login', { method: 'email', email });
        crashlytics().log('User login successful');
        crashlytics().setAttribute('email', email);
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

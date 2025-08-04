import { useState } from 'react';

import { useDispatch } from 'react-redux';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import firestore from '@react-native-firebase/firestore';

import { useNavigation } from '@react-navigation/native';
import { setStateKey } from '@redux/slices/AuthSlice';
import useValidation from '@utils/validationSchema';
import { AUTH } from '@utils/constant';
import { AuthNavigationProp } from '@types/navigations';
import { showError, showSuccess } from '@utils/toast';

export type RegistrationValues = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  password: string;
  confirmPassword: string;
};

type UseRegisterOptions = {
  onNavigateToLogin?: () => void;
};

const useRegister = (options?: UseRegisterOptions) => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const auth = getAuth();
  const navigation = useNavigation<AuthNavigationProp>();
  const { registrationValidationSchema } = useValidation();

  const initialValues: RegistrationValues = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
  };

  const saveUserToFirestore = async (userId: string, userData: any) => {
    try {
      await firestore().collection('users').doc(userId).set(userData);
    } catch (error) {
      console.error('[Firestore] Error saving user:', error);
    }
  };

  const handleRegister = async (values: RegistrationValues) => {
    const trace = await perf().startTrace('registration');
    setLoading(true);
    try {
      crashlytics().log('Registration started for ' + values.email);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredential.user;
      if (!user) {
        throw new Error('No user created');
      }

      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobileNo: values.mobileNo,
      };
      await saveUserToFirestore(user.uid, userData);
      dispatch(setStateKey({ key: 'userData', value: userData }));

      await analytics().logEvent('register', {
        method: 'email',
        email: values.email,
      });
      crashlytics().log('Registration successful');
      crashlytics().setUserId(user.uid);
      crashlytics().setAttribute('email', values.email);

      showSuccess('Registration Successful!');
      navigation.navigate(AUTH.Login);
    } catch (error: any) {
      crashlytics().log('Registration error');
      crashlytics().recordError(error);
      console.error(
        '[Register] Error code:',
        error.code,
        'message:',
        error.message,
      );

      if (error.code === 'auth/email-already-in-use') {
        showError('Email already in use.');
      } else if (error.code === 'auth/invalid-email') {
        showError('Invalid email format.');
      } else {
        showError(
          error?.response?.data?.message ||
            'Registration failed. Please try again.',
        );
      }
    } finally {
      setLoading(false);
      trace.stop();
    }
  };

  const navigateToLogin = () => {
    if (options?.onNavigateToLogin) {
      options.onNavigateToLogin();
    }
    navigation.replace(AUTH.Login);
  };

  return {
    initialValues,
    registrationValidationSchema,
    handleRegister,
    loading,
    navigateToLogin,
  };
};

export default useRegister;

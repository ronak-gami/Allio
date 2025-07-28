import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
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

const useRegister = () => {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredential.user;

      if (user) {
        const userData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          mobileNo: values.mobileNo,
        };

        await saveUserToFirestore(user.uid, userData);
        dispatch(setStateKey({ key: 'userData', value: userData }));
        showSuccess('Registration Successful!');
        navigation.navigate(AUTH.Login);
      }
    } catch (error: any) {
      console.error('[Register] Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        console.error('Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        console.error('Invalid email format');
      } else {
        console.error('Something went wrong:', error.message);
        showError(
          error?.response?.data?.message ||
            'Registration failed. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate(AUTH.Login);
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

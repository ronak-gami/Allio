import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Formik } from 'formik';
import { registrationValidationSchema } from '../../../utils/validationSchema';
import FirstnameField from '../../molecules/FirstnameField';
import LastnameField from '../../molecules/LastnameField';
import MobilenoField from '../../molecules/MobileFiled';
import EmailField from '../../molecules/EmailField';
import PasswordField from '../../molecules/PasswordFields';
import Button from '../../atoms/Button';
import styles from './style';
import Text from '../../atoms/Text';
import { useNavigation } from '@react-navigation/native';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';
import { setStateKey } from '../../../redux/slices/AuthSlice';
import { AUTH } from '../../../utils/constant';

type RegistrationValues = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  password: string;
  confirmPassword: string;
};

const RegistrationForm = () => {
  const initialValues: RegistrationValues = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
  };

  const dispatch = useDispatch();
  const auth = getAuth();
  const navigation = useNavigation();

  const saveUserToFirestore = async (userId: string, userData: any) => {
    try {
      await firestore().collection('users').doc(userId).set(userData);
      console.log('[Firestore] User data saved successfully:', userData);
    } catch (error) {
      console.error('[Firestore] Error saving user data:', error);
    }
  };

  const handleRegister = async (values: RegistrationValues) => {
    try {
      console.log('[Register] Registration started...');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredential.user;
      if (user) {
        console.log('[Register] User created:', user.uid);
        const userData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          mobileNo: values.mobileNo,
        };
        await saveUserToFirestore(user.uid, userData);
        dispatch(setStateKey({ key: 'userData', value: userData }));
        console.log('[Register] Registration complete, navigating to Login...');
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
      }
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={registrationValidationSchema}
          onSubmit={handleRegister}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Register</Text>
              <Text style={styles.subtitle}>
                Create your account to get started
              </Text>
              <View style={styles.form}>
                <FirstnameField
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  error={touched.firstName ? errors.firstName : ''}
                />
                <LastnameField
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  error={touched.lastName ? errors.lastName : ''}
                />
                <MobilenoField
                  value={values.mobileNo}
                  onChangeText={handleChange('mobileNo')}
                  error={touched.mobileNo ? errors.mobileNo : ''}
                />
                <EmailField
                  value={values.email}
                  onChangeText={handleChange('email')}
                  error={touched.email ? errors.email : ''}
                />
                <PasswordField
                  value={values.password}
                  onChangeText={handleChange('password')}
                  error={touched.password ? errors.password : ''}
                />
                <PasswordField
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  error={touched.confirmPassword ? errors.confirmPassword : ''}
                  placeholder="Confirm Password"
                />
              </View>
              <Button
                title="Register"
                onPress={handleSubmit as () => void}
                style={styles.loginButton}
              />

              <TouchableOpacity>
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text
                    style={styles.loginLink}
                    onPress={() => navigation.navigate(AUTH.Login)}>
                    Login
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegistrationForm;

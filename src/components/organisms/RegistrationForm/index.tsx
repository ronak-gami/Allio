import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';
import { setStateKey } from 'src/redux/slices/AuthSlice';
import useValidation from '../../../utils/validationSchema';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AUTH } from '@utils/constant';
import FirstnameField from '@components/molecules/FirstnameField';
import LastnameField from '@components/molecules/LastnameField';
import MobilenoField from '@components/molecules/MobileFiled';
import EmailField from '@components/molecules/EmailField';
import PasswordField from '@components/molecules/PasswordFields';
import useStyle from './style';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';

type RegistrationValues = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  password: string;
  confirmPassword: string;
};

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);

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
  const styles=useStyle()
  const { registrationValidationSchema } = useValidation();

  const saveUserToFirestore = async (userId: string, userData: any) => {
    try {
      await firestore().collection('users').doc(userId).set(userData);
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView  behavior="padding">
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
                disabled={loading}
                loading={loading}
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

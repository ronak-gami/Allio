import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Formik} from 'formik';
import {registrationValidationSchema} from '../../../utils/validationSchema';
import FirstnameField from '../../molecules/FirstnameField';
import LastnameField from '../../molecules/LastnameField';
import MobilenoField from '../../molecules/MobileFiled';
import EmailField from '../../molecules/EmailField';
import PasswordField from '../../molecules/PasswordFields';
import Button from '../../atoms/Button';
import styles from './style';
import Text from '../../atoms/Text';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useNavigation} from '@react-navigation/native';

const RegistrationForm = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
  };

  const handleRegister = (values: typeof initialValues) => {
    console.log('Registration values:', values);
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={registrationValidationSchema}
          onSubmit={handleRegister}>
          {({handleChange, handleSubmit, values, errors, touched}) => (
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
                    onPress={() => navigation.navigate('LoginScreen')}>
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

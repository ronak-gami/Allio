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
import {Text as PaperText} from 'react-native-paper';
import {getAuth} from '@react-native-firebase/auth';

const RegistrationForm = () => {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
  };

  const handleRegister = async (values: typeof initialValues) => {
    try {
      const auth = getAuth();
      const userCredential = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password,
      );
      console.log('-----------userCredential-----------', userCredential);
    } catch (error) {
      console.error('error into handleRegister :- ', error);
    }
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
              <PaperText style={styles.title}>Register</PaperText>
              <PaperText style={styles.subtitle}>
                Create your account to get started
              </PaperText>
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
                <PaperText style={styles.loginText}>
                  Already have an account?{' '}
                  <PaperText style={styles.loginLink}>Login</PaperText>
                </PaperText>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegistrationForm;

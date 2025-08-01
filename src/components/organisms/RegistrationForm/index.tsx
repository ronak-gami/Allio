import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Formik } from 'formik';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import Input from '@components/atoms/Input';
import useRegister from './useRegisterForm';
import useAnalytics from '@hooks/useAnalytics';

import useStyle from './style';
const RegistrationForm = () => {
  const styles = useStyle();
  const { track } = useAnalytics({ screenName: 'RegistrationForm' });
  const {
    initialValues,
    registrationValidationSchema,
    handleRegister,
    loading,
    navigateToLogin,
  } = useRegister();

  const onLoginSubmit = async (
    values: any,
    track: ReturnType<typeof useAnalytics>['track'],
    handleRegister: (values: any) => Promise<void>,
  ) => {
    track.event('signup_click', { source: 'register_button' });
    await track.signup('email');
    await handleRegister(values);
  };
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title} type="bold">
        Register
      </Text>
      <Text style={styles.subtitle}>Create your account to get started</Text>
      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={registrationValidationSchema}
          onSubmit={values => onLoginSubmit(values, track, handleRegister)}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              <Input
                placeholder="First Name"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                error={touched.firstName ? errors.firstName : ''}
                autoCapitalize="words"
              />
              <Input
                placeholder="Last Name"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                error={touched.lastName ? errors.lastName : ''}
                autoCapitalize="words"
              />
              <Input
                placeholder="Mobile Number"
                value={values.mobileNo}
                onChangeText={handleChange('mobileNo')}
                error={touched.mobileNo ? errors.mobileNo : ''}
                keyboardType="phone-pad"
                maxlength={10}
              />
              <Input
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email ? errors.email : ''}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password ? errors.password : ''}
                isPassword
                maxlength={12}
              />
              <Input
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : ''}
                isPassword
                maxlength={12}
              />
              <Button
                title="Register"
                onPress={handleSubmit as () => void}
                disabled={loading}
                loading={loading}
              />
            </>
          )}
        </Formik>
      </View>
      <View style={styles.dividerContainer}>
        <Text label="no_account" style={styles.orText} />
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.loginText} type="semibold">
            Login{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationForm;

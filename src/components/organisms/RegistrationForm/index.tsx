import React, { useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import useRegister from './useRegisterForm';
import useAnalytics from '@hooks/useAnalytics';
import { FormikProps } from 'formik';
import useStyle from './style';
import Input from '@components/atoms/Input';

const RegistrationForm = () => {
  const styles = useStyle();
  const { track } = useAnalytics({ screenName: 'RegistrationForm' });
  const formikRef = useRef<FormikProps<any>>(undefined);
  const {
    initialValues,
    registrationValidationSchema,
    handleRegister,
    loading,
    navigateToLogin,
  } = useRegister({
    onNavigateToLogin: () => {
      formikRef.current?.resetForm();
    },
  });

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
      <Text label="register" style={styles.title} type="bold" />
      <Text label="register_subtitle" style={styles.subtitle} />
      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={registrationValidationSchema}
          onSubmit={values => onLoginSubmit(values, track, handleRegister)}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              <Input
                label="First Name"
                placeholder="e.g., Ronak"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                error={touched.firstName ? errors.firstName : undefined}
                touched={touched.firstName}
                autoCapitalize="words"
              />

              <Input
                label="Last Name"
                placeholder="e.g., Gami"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                error={touched.lastName ? errors.lastName : undefined}
                touched={touched.lastName}
                autoCapitalize="words"
              />

              <Input
                label="Email"
                placeholder="e.g., Ronak.Gami@example.com"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email ? errors.email : undefined}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Mobile Number"
                placeholder="e.g., 9876543210"
                value={values.mobileNo}
                onChangeText={handleChange('mobileNo')}
                error={touched.mobileNo ? errors.mobileNo : undefined}
                touched={touched.mobileNo}
                keyboardType="phone-pad"
                maxLength={10}
              />

              <Input
                label="Password"
                placeholder="Password@123"
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password ? errors.password : undefined}
                touched={touched.password}
                secureTextEntry
              />

              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                error={
                  touched.confirmPassword ? errors.confirmPassword : undefined
                }
                touched={touched.confirmPassword}
                secureTextEntry
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
          <Text style={styles.loginText} label="login" type="semibold" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationForm;

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import Input from '@components/atoms/Input';
import { AUTH } from '@utils/constant';
import useRegister from './useRegisterForm';
import useStyle from './style';


const RegistrationForm = () => {
  const navigation = useNavigation();
  const styles = useStyle();

  const {
    initialValues,
    registrationValidationSchema,
    handleRegister,
    loading,
  } = useRegister();

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Create your account to get started</Text>
      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={registrationValidationSchema}
          onSubmit={handleRegister}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              <Input
                placeholder="First Name"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                error={touched.firstName ? errors.firstName : ''}
                maxlength={25}
                autoCapitalize="words"
              />
              <Input
                placeholder="Last Name"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                error={touched.lastName ? errors.lastName : ''}
                maxlength={25}
                autoCapitalize="words"
              />
              <Input
                placeholder="Mobile Number"
                value={values.mobileNo}
                onChangeText={handleChange('mobileNo')}
                error={touched.mobileNo ? errors.mobileNo : ''}
                keyboardType="phone-pad"
                maxlength={12}
              />
              <Input
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email ? errors.email : ''}
                keyboardType="email-address"
                autoCapitalize="none"
                maxlength={25}
              />
              <Input
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password ? errors.password : ''}
                isPassword
                maxlength={25}
              />
              <Input
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : ''}
                isPassword
                maxlength={25}
              />
              <Button
                title="Register"
                onPress={handleSubmit as () => void}
                disabled={loading}
                loading={loading}
                style={styles.loginButton}
              />
            </>
          )}
        </Formik>
      </View>
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate(AUTH.Login)}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default RegistrationForm;

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import Text from '@components/atoms/Text';
import Input from '@components/atoms/Input';
import RememberForgot from '@components/molecules/RememberForget';
import Button from '@components/atoms/Button';
import { useLoginForm } from './useLoginForm';
import SignInWithFacebook from '@components/molecules/SocialSignInFacebook';
import SignInWithGoogle from '@components/molecules/SocialSignInGoogle';
import useStyle from './style';

const LoginForm: React.FC = () => {
  const styles = useStyle();
  const {
    initialValues,
    loginValidationSchema,
    handleLogin,
    remember,
    setRemember,
    loading,
    navigateToRegister,
  } = useLoginForm();
  return (
    <View style={styles.formContainer}>
      <Text label="login" style={styles.title} type="bold" />
      <Text label="login_subtitle" style={styles.subtitle} />

      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              <Input
                placeholder="email"
                maxlength={25}
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email ? errors.email : ''}
              />
              <Input
                placeholder="Password"
                maxlength={25}
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password ? errors.password : ''}
                isPassword
              />
              <RememberForgot
                remember={remember}
                onCheckboxPress={setRemember}
              />
              <Button
                title="Login"
                onPress={handleSubmit as () => void}
                disabled={loading}
                loading={loading}
              />
            </>
          )}
        </Formik>
      </View>
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.socialSignInText}>Social Sign-In</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.SocialButtonStyle}>
        <SignInWithFacebook />
        <SignInWithGoogle />
      </View>
      <View style={styles.dividerContainer}>
        <Text label="no_account" style={styles.orText} />
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.signUpText} type="semibold">
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;

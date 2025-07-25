import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import Text from '@components/atoms/Text';
import Input from '@components/atoms/Input';
import PasswordField from '@components/molecules/PasswordFields';
import RememberForgot from '@components/molecules/RememberForget';
import Button from '@components/atoms/Button';
import SignInWithFacebook from '../../molecules/SocialSignInFacebook';
import SignInWithGoogle from '../../molecules/SocialSignInGoogle';
import useStyle from './style';
import { useLoginForm } from './useLoginForm';

interface LoginFormUIProps {
  initialValues: { email: string; password: string };
  validationSchema: any;
  handleLogin: (values: { email: string; password: string }) => void;
  remember: boolean;
  setRemember: () => void;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormUIProps> = () => {
  const styles = useStyle();
  const {
    initialValues,
    validationSchema,
    handleLogin,
    remember,
    setRemember,
    loading,
  } = useLoginForm();

  return (
    <View style={styles.formContainer}>
      <Text label="login" style={styles.title} type="bold" />
      <Text label="login_subtitle" style={styles.subtitle} />

      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
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
              <PasswordField
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password ? errors.password : ''}
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
                style={styles.loginButton}
              />
            </>
          )}
        </Formik>
      </View>

      <View style={styles.socialButtonsWrapper}>
        <Text style={styles.socialSignInText}>Social Sign-In</Text>
        <View style={styles.SocialButtonStyle}>
          <SignInWithFacebook />
          <SignInWithGoogle />
        </View>
        <View style={styles.dividerContainer}>
          <Text label="no_account" style={styles.orText} />
          <TouchableOpacity>
            <Text label="register" style={styles.signUpText} type="semibold" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;

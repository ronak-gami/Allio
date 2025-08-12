import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';

import Text from '@components/atoms/Text';
import RememberForgot from '@components/molecules/RememberForget';
import { useLoginForm } from './useLoginForm';
import SignInWithFacebook from '@components/molecules/SocialSignInFacebook';
import SignInWithGoogle from '@components/molecules/SocialSignInGoogle';
import { useAnalytics } from '@hooks/index';
import SignInWithGitHub from '@components/molecules/SocialGithub';

import useStyle from './style';
import Button from '@components/atoms/Button';
import Input from '@components/atoms/Input';
interface LoginFormProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLoading }) => {
  const { track } = useAnalytics({ screenName: 'LoginForm' });
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
  const onLoginSubmit = async (
    values: any,
    track: ReturnType<typeof useAnalytics>['track'],
    handleLogin: (values: any) => Promise<void>,
  ) => {
    track.event('login_click', { source: 'login_button' });
    await track.login('email');
    await handleLogin(values);
  };
  return (
    <View style={styles.formContainer}>
      <Text label="login" style={styles.title} type="bold" />
      <Text label="login_subtitle" style={styles.subtitle} />

      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={values => onLoginSubmit(values, track, handleLogin)}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <>
              <Input
                label="Email"
                placeholder="e.g., Ronak.Gami@example.com"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={errors.password}
                touched={touched.password}
                secureTextEntry
              />

              <RememberForgot
                remember={remember}
                onCheckboxPress={setRemember}
              />
              <Button
                title="login"
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
        <Text style={styles.socialSignInText} label="social_sign_in">
          Social Sign-In
        </Text>
        <View style={styles.line} />
      </View>

      <View style={styles.SocialButtonStyle}>
        <SignInWithFacebook setLoading={setLoading} />
        <SignInWithGoogle setLoading={setLoading} />
        <SignInWithGitHub />
      </View>
      <View style={styles.dividerContainer}>
        <Text label="no_account" style={styles.orText} />
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.signUpText} label="register" type="semibold" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;

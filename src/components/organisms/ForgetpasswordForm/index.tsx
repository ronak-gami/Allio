import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Formik } from 'formik';
import useValidation from '../../../utils/validationSchema';
import { scale } from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';
import { checkUserExistsByEmail } from '@utils/helper';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import useStyle from './style';
import Input from '@components/atoms/Input';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@types/navigations';
import { AUTH } from '@utils/constant';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { forgotPasswordSchema } = useValidation();
  const style = useStyle();
  const handleForgotPassword = async (values: { email: string }) => {
    const email = values.email.trim().toLowerCase();

    try {
      if (!email) {
        return { success: false, message: 'Please enter your email address.' };
      }

      const userExists = await checkUserExistsByEmail(email);

      if (!userExists) {
        return { success: false, message: 'No user found with this email.' };
      }

      await auth().sendPasswordResetEmail(email);

      return {
        success: true,
        message: 'Password reset email sent successfully!',
      };
    } catch (error: any) {
      let message = 'Something went wrong';
      if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No user found with this email';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error, check your internet connection';
      } else {
      }
      return { success: false, message };
    }
  };
  const navigateToLogin = () => {
    navigation.navigate(AUTH.Login);
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={scale(60)}>
      <ScrollView
        contentContainerStyle={style.scrollView}
        keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={style.form}>
              <Text style={style.title} type="bold">
                Forgot Password
              </Text>
              <Text style={style.subtitle}>
                Enter your email to receive a password reset link
              </Text>
              <Input
                placeholder="email"
                maxlength={25}
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email ? errors.email : ''}
              />
              <Button
                title="Send Reset Link"
                onPress={handleSubmit as () => void}
              />
            </View>
          )}
        </Formik>
        <View style={style.dividerContainer}>
          <Text label="no_account" style={style.orText} />
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={style.loginText} type="semibold">
              Login{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

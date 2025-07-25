import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import useValidation from '../../../utils/validationSchema';
import { scale } from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';
import { checkUserExistsByEmail } from '@utils/helper';
import Text from '@components/atoms/Text';
import EmailField from '@components/molecules/EmailField';
import Button from '@components/atoms/Button';
import useStyle from './style';

const ForgotPasswordScreen: React.FC = () => {
  const { forgotPasswordSchema } = useValidation();
  const style=useStyle()
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

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={scale(60)}>
      <ScrollView
        contentContainerStyle={style.scrollView}
        keyboardShouldPersistTaps="handled">
        {/* <Image source={ICONS.ArrowRight} style={{width: 24, height: 24}} /> */}

        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={style.form}>
              <Text style={style.title}>Forgot Password</Text>
              <Text style={style.subtitle}>
                Enter your email to receive a password reset link
              </Text>

              <EmailField
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email && errors.email ? errors.email : ''}
              />

              <Button
                title="Send Reset Link"
                onPress={handleSubmit as () => void}
                style={style.loginButton}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

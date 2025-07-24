import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import { scale } from 'react-native-size-matters';
import style from './style';
import auth from '@react-native-firebase/auth';
import { checkUserExistsByEmail } from '@utils/helper';
import { forgotPasswordSchema } from '@utils/validationSchema';
import Text from '@components/atoms/Text';
import EmailField from '@components/molecules/EmailField';
import Button from '@components/atoms/Button';

const ForgotPasswordForm: React.FC = () => {
  const handleForgotPassword = async (values: { email: string }) => {
    const email = values.email.trim().toLowerCase();
    console.log('Initiating password reset for email:', email);

    try {
      if (!email) {
        console.log('❌ No email provided!');
        return { success: false, message: 'Please enter your email address.' };
      }

      console.log('🔍 Checking if user exists in Firestore...');
      const userExists = await checkUserExistsByEmail(email);

      if (!userExists) {
        console.log('❌ User not found in Firestore');
        return { success: false, message: 'No user found with this email.' };
      }

      console.log('✅ User found, sending password reset email...');
      await auth().sendPasswordResetEmail(email);

      console.log('✅ Password reset email sent successfully to:', email);
      return {
        success: true,
        message: 'Password reset email sent successfully!',
      };
    } catch (error: any) {
      console.error('❌ Error in sendPasswordReset:', error);
      let message = 'Something went wrong';
      if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
        console.log('⚠️ Error: Invalid email format');
      } else if (error.code === 'auth/user-not-found') {
        message = 'No user found with this email';
        console.log('⚠️ Error: Email does not exist in Firebase Auth');
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error, check your internet connection';
        console.log('⚠️ Error: Network failure');
      } else {
        console.log('⚠️ Unknown error:', error.code);
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

export default ForgotPasswordForm;

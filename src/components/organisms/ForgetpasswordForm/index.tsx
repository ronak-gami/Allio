import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Formik } from 'formik';
import { scale } from 'react-native-size-matters';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import Input from '@components/atoms/Input';
import useStyle from './style';
import { useForgotPassword } from './useForgetpassForm';
import useValidation from '@utils/validationSchema';

const ForgotPasswordScreen: React.FC = () => {
  const { forgotPasswordSchema } = useValidation();
  const style = useStyle();
  const { handleForgotPassword, navigateToLogin } = useForgotPassword();

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

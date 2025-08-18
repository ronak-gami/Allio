import React, { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Formik, FormikProps } from 'formik';

import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import Input from '@components/atoms/Input';
import useValidation from '@utils/validationSchema';

import { useForgotPassword } from './useForgetpassForm';
import useStyle from './style';

const ForgotPasswordForm: React.FC = () => {
  const { forgotPasswordSchema } = useValidation();
  const style = useStyle();

  const formikRef = useRef<FormikProps<{ email: string }>>(undefined);

  const { handleForgotPassword, navigateToLogin, loading } = useForgotPassword({
    onNavigateToLogin: () => {
      formikRef.current?.resetForm();
    },
  });

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={style.scrollView}
        keyboardShouldPersistTaps="handled">
        <Formik
          innerRef={formikRef}
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <View style={style.form}>
              <Text style={style.title} label="forgot_password" type="bold" />
              <Text style={style.subtitle} label="forgot_password_subtitle" />
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
              <Button
                loading={loading}
                disabled={loading}
                title="Send Reset Link"
                onPress={handleSubmit as () => void}
              />
            </View>
          )}
        </Formik>

        <View style={style.dividerContainer}>
          <Text label="no_account" style={style.orText} />
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={style.loginText} label="login" type="semibold" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordForm;

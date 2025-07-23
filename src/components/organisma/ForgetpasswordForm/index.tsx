import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import EmailField from '../../molecules/EmailField';
import Button from '../../atoms/Button';
import {scale} from 'react-native-size-matters';
import style from './style';
import {ICONS} from '../../../assets';
import Text from '../../atoms/Text';
import useValidation from '../../../utils/validationSchema';

import {useNavigation} from '@react-navigation/native';

const ForgotPasswordScreen: React.FC = () => {
  const {forgotPasswordSchema} = useValidation();

  const handleForgotPassword = (values: {email: string}) => {
    // Perform API call here
    console.log('Reset email sent to:', values.email);
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={scale(60)}>
      <ScrollView
        contentContainerStyle={style.scrollView}
        keyboardShouldPersistTaps="handled">
        {/* <Image source={ICONS.ArrowRight} style={{width: 24, height: 24}} /> */}

        <Formik
          initialValues={{email: ''}}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
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

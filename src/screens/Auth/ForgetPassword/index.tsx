import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ForgotPasswordForm from '@components/organisms/ForgetpasswordForm';
import { AuthStackParamList } from '@types/navigations';

import useStyle from './style';
type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgetPassword: React.FC<Props> = () => {
  const styles = useStyle();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ForgotPasswordForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgetPassword;

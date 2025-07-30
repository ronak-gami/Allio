import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import useStyle from './style';
import ForgotPasswordForm from '@components/organisms/ForgetpasswordForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types/navigations';

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

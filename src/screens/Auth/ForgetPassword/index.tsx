import React from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import ForgotPasswordForm from '../../../components/organisms/ForgetpasswordForm';
import useStyle from './style';

const ForgotPassword = () => {
  const styles = useStyle();
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ForgotPasswordForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

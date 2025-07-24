import React from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import useStyle from './style';
import LoginForm from '@components/organisms/LoginForm';

const LoginScreen = () => {
  const styles = useStyle();
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <LoginForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;

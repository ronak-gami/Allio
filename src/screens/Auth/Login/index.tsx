import React from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import LoginForm from '../../../components/organisms/LoginForm';
import useStyle from './style';

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

import React from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import useStyle from './style';
import RegistrationForm from '@components/organisms/RegistrationForm';

const RegisterScreen = () => {
  const styles = useStyle();
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.ScrollingStyle}>
        <RegistrationForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default RegisterScreen;

import React from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import RegistrationForm from '../../../components/organisms/RegistrationForm';
import useStyle from './style';

const RegisterScreen = () => {
  const styles = useStyle();
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <RegistrationForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default RegisterScreen;

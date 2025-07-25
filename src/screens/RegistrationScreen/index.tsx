import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

import RegistrationForm from '../../components/organisms/RegistrationForm';

import { useStyle } from './style';

const RegisterScreen = () => {
  const styles = useStyle();
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      {/* <ScrollView contentContainerStyle={styles.container}> */}
      <RegistrationForm />
      {/* </ScrollView> */}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

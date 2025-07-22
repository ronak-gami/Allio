import React from 'react';
import {StyleSheet, ScrollView, KeyboardAvoidingView} from 'react-native';
import RegistrationForm from '../../components/organisma/RegistrationForm';

const RegisterScreen = () => {
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <RegistrationForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default RegisterScreen;

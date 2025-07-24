import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import ForgotPasswordScreen from '../../components/organisms/ForgetpasswordForm';

const ForgotPassword = () => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <ForgotPasswordScreen />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    // justifyContent: 'center',
    // padding: 16,
  },
});

export default ForgotPassword;

import React from 'react';
import { ScrollView, KeyboardAvoidingView, View } from 'react-native';
import LoginForm from '../../components/organisms/LoginForm';
import SignInWithGoogle from '../../components/molecules/SocialSignInGoogle';
import SignInWithFacebook from '../../components/molecules/SocialSignInFacebook';
import { useStyle } from './style';

const LoginScreen = () => {
  const styles=useStyle()
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
     
        <LoginForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



export default LoginScreen;

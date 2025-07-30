import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import useStyle from './style';
import LoginForm from '@components/organisms/LoginForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types/navigations';
import CustomLoader from '@components/atoms/CustomLoader';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login: React.FC<Props> = () => {
  const styles = useStyle();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <LoginForm setLoading={setLoading} />
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomLoader visible={loading} />
    </>
  );
};

export default Login;

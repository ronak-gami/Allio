import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import LoginForm from '@components/organisms/LoginForm';
import CustomLoader from '@components/atoms/CustomLoader';
import { AuthStackParamList } from '@types/navigations';
import { useAnalytics } from '@hooks/index';

import useStyle from './style';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
const Login: React.FC<Props> = () => {
  const styles = useStyle();
  useAnalytics({ screenName: 'Login' });
  const [loading, setLoading] = useState<boolean>(false);
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

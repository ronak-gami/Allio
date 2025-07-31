import React from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import useStyle from './style';
import LoginForm from '@components/organisms/LoginForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types/navigations';
import useAnalytics from '@hooks/useAnalytics';
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login: React.FC<Props> = () => {
  const styles = useStyle();
  useAnalytics({ screenName: 'Login' });
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <LoginForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Login;

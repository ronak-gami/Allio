import React from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import useStyle from './style';
import ForgotPasswordForm from '@components/organisms/ForgetpasswordForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types/navigations';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgetPassword: React.FC<Props> = () => {
  const styles = useStyle();
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ForgotPasswordForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgetPassword;

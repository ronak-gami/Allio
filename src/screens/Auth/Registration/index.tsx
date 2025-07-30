import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import useStyle from './style';
import RegistrationForm from '@components/organisms/RegistrationForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types/navigations';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const Registration: React.FC<Props> = () => {
  const styles = useStyle();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.ScrollingStyle}>
        <RegistrationForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Registration;

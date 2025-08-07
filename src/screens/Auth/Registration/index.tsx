import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import StatusBar from '@components/atoms/StatusBar';
import RegistrationForm from '@components/organisms/RegistrationForm';
import { AuthStackParamList } from '@types/navigations';
import { useAnalytics } from '@hooks/index';

import useStyle from './style';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const Registration: React.FC<Props> = () => {
  const styles = useStyle();
  useAnalytics({ screenName: 'Register' });
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.statusBar.backgroundColor}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.ScrollingStyle}>
          <RegistrationForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};
export default Registration;

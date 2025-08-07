import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import RegistrationForm from '@components/organisms/RegistrationForm';
import { AuthStackParamList } from '@types/navigations';
import { useAnalytics } from '@hooks/index';
import Container from '@components/molecules/Container';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const Registration: React.FC<Props> = () => {
  useAnalytics({ screenName: 'Register' });

  return (
    <Container showHeader={false} useScrollView keyboardAvoiding>
      <RegistrationForm />
    </Container>
  );
};

export default Registration;

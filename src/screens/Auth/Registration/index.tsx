import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import RegistrationForm from '@components/organisms/RegistrationForm';
import { AuthStackParamList } from '@types/navigations';
import { useAnalytics } from '@hooks/index';
import Container from '@components/molecules/Container';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const Registration: React.FC<Props> = () => {
  useAnalytics({ screenName: 'Register' });
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Container showHeader={false} auth keyboardAvoiding showLoader={loading}>
      <RegistrationForm setLoading={setLoading} />
    </Container>
  );
};

export default Registration;

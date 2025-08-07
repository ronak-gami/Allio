import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import LoginForm from '@components/organisms/LoginForm';
import { AuthStackParamList } from '@types/navigations';
import { useAnalytics } from '@hooks/index';
import Container from '@components/molecules/Container';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login: React.FC<Props> = () => {
  useAnalytics({ screenName: 'Login' });
  const [loading, setLoading] = useState(false);

  return (
    <Container showHeader={false} auth keyboardAvoiding showLoader={loading}>
      <LoginForm setLoading={setLoading} />
    </Container>
  );
};

export default Login;

import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import LoginForm from '@components/organisms/LoginForm';
import { AuthStackParamList } from '@types/navigations';
import { useAnalytics } from '@hooks/index';
import PageLayout from '@components/molecules/Container';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login: React.FC<Props> = () => {
  useAnalytics({ screenName: 'Login' });
  const [loading, setLoading] = useState(false);

  return (
    <PageLayout showHeader={false} useScrollView keyboardAvoiding>
      <LoginForm setLoading={setLoading} />
    </PageLayout>
  );
};

export default Login;

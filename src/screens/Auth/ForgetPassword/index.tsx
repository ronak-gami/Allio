import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ForgotPasswordForm from '@components/organisms/ForgetpasswordForm';
import { AuthStackParamList } from '@types/navigations';

import useStyle from './style';
import Container from '@components/molecules/Container';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgetPassword: React.FC<Props> = () => {
  const styles = useStyle();

  return (
    <Container showHeader={false} useScrollView keyboardAvoiding>
      <ForgotPasswordForm />
    </Container>
  );
};

export default ForgetPassword;

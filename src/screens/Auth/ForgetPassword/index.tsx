import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ForgotPasswordForm from '@components/organisms/ForgetpasswordForm';
import { AuthStackParamList } from '@types/navigations';

import useStyle from './style';
import PageLayout from '@components/molecules/Container';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgetPassword: React.FC<Props> = () => {
  const styles = useStyle();

  return (
    <PageLayout showHeader={false} useScrollView keyboardAvoiding>
      <ForgotPasswordForm />
    </PageLayout>
  );
};

export default ForgetPassword;

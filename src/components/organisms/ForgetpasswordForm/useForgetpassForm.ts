import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import { checkUserExistsByEmail } from '@utils/helper';
import { AUTH } from '@utils/constant';
import { AuthNavigationProp } from '@types/navigations';
import { showError, showSuccess } from '@utils/toast';
import { useState } from 'react';

type UseForgotPasswordOptions = {
  onNavigateToLogin?: () => void;
};

export const useForgotPassword = (options?: UseForgotPasswordOptions) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<AuthNavigationProp>();

  const navigateToLogin = () => {
    if (options?.onNavigateToLogin) {
      options.onNavigateToLogin();
    }
    navigation.popToTop();
  };

  const handleForgotPassword = async (values: { email: string }) => {
    const email = values.email.trim().toLowerCase();
    setLoading(true);
    try {
      if (!email) {
        showError('Email is required');
        return;
      }

      const userExists = await checkUserExistsByEmail(email);
      if (!userExists) {
        showError('Email Does Not Exist!');
        return;
      }

      await auth().sendPasswordResetEmail(email);
      showSuccess('Password reset email sent successfully!');
      navigation.navigate(AUTH.Login);
      return;
    } catch (error: any) {
      let message = 'Something went wrong';
      if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No user found with this email';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error, check your internet connection';
      }
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return { handleForgotPassword, navigateToLogin, loading };
};

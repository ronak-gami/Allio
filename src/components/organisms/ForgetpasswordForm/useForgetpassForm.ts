// useForgotPassword.ts
import auth from '@react-native-firebase/auth';
import { checkUserExistsByEmail } from '@utils/helper';
import { useNavigation } from '@react-navigation/native';
import { AUTH } from '@utils/constant';
import { AuthNavigationProp } from '@types/navigations';

export const useForgotPassword = () => {

    const navigation = useNavigation<AuthNavigationProp>();
    const navigateToLogin = () => {
        navigation.navigate(AUTH.Login);
      };

  const handleForgotPassword = async (values: { email: string }) => {
    const email = values.email.trim().toLowerCase();

    try {
      if (!email) {
        return { success: false, message: 'Please enter your email address.' };
      }

      const userExists = await checkUserExistsByEmail(email);

      if (!userExists) {
        return { success: false, message: 'No user found with this email.' };
      }

      await auth().sendPasswordResetEmail(email);

      return {
        success: true,
        message: 'Password reset email sent successfully!',
      };
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
    }
  };

  return { handleForgotPassword ,
    navigateToLogin
  };
};

import React from 'react';
import { useDispatch } from 'react-redux';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import {
  FacebookAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import SocialButton from '../socialButton';
import { setStateKey } from '@redux/slices/AuthSlice';
import { checkUserExistsByEmail } from '@utils/helper';
import { ICONS } from '@assets/index';
import { showError } from '@utils/toast';
import messaging from '@react-native-firebase/messaging';

interface SignInWithFacebookProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignInWithFacebook: React.FC<SignInWithFacebookProps> = ({
  setLoading,
}) => {
  const dispatch = useDispatch();

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      // Step 1: Trigger Facebook login
      const result = await LoginManager?.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      // Step 2: Get access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      // Step 3: Create Facebook credential & sign in
      const facebookCredential = FacebookAuthProvider?.credential(
        data.accessToken,
      );
      const userCredential = await signInWithCredential(
        getAuth(),
        facebookCredential,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Step 4: Check if user already exists in Firestore
      await checkUserExistsByEmail(user.email);

      const userData = {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email,
        profileImage: user.photoURL || '',
        provider: 'facebook',
        createdAt: new Date().toISOString(),
      };

      // Step 5: Save token & user data in Redux
      if (!userExists) {
        await firestore().collection('users').doc(user.uid).set(userData);
      }
      if (user) {
        const fcmToken = await messaging()?.getToken();
        if (fcmToken) {
          await firestore().collection('users').doc(user.uid).set(
            {
              fcmToken,
              fcmUpdatedAt: firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
        } else {
          console.warn('FCM token not available after login.');
        }
      }
      dispatch(setStateKey({ key: 'token', value: token }));
      dispatch(setStateKey({ key: 'userData', value: userData }));
    } catch (error: any) {
      console.error('Facebook Login Error:', error);

      // ✅ Specific error handling
      if (error.code === 'auth/account-exists-with-different-credential') {
        // This happens when the email is already linked to another provider (e.g., Google)
        showError(
          'An account with this email already exists. Please sign in using your original method (Google or Email).',
        );
      } else if (error.message === 'User cancelled the login process') {
        // Silent exit for user cancellation
        return;
      } else if (error.code === 'auth/network-request-failed') {
        showError(
          'Network error. Please check your internet connection and try again.',
        );
      } else if (error.code === 'auth/popup-closed-by-user') {
        showError(
          'The login popup was closed before completing. Please try again.',
        );
      } else {
        // Generic fallback error
        showError(
          'There was an issue signing you in with Facebook. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SocialButton
      icon={ICONS.FaceBook}
      onPress={handleFacebookLogin}
      accessibilityLabel="Login with Facebook"
      testID="facebook-login"
    />
  );
};

export default SignInWithFacebook;

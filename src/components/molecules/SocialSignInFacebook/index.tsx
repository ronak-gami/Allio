import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import {
  FacebookAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SocialButton from '../socialButton';
import { setStateKey } from '@redux/slices/AuthSlice';
import { checkUserExistsByEmail } from '@utils/helper';
import { ICONS } from '@assets/index';
import { showError, showSuccess } from '@utils/toast';

interface SignInWithFacebookProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  register?: boolean; // 👈 new prop
}

const SignInWithFacebook: React.FC<SignInWithFacebookProps> = ({
  setLoading,
  register = false,
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

      // Step 4: Prepare user data
      const userData = {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email,
        profileImage: user.photoURL || '',
        provider: 'facebook',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      // Step 5: Handle based on register mode
      const exists = await checkUserExistsByEmail(user.email);

      if (register) {
        // Register flow
        if (exists) {
          showError('User already registered with this email.');
          return;
        } else {
          await firestore().collection('users').doc(user.uid).set(userData);
          showSuccess('Registration successful!');
        }
      } else {
        // Login flow
        if (!exists) {
          // Auto create user if not exists
          await firestore().collection('users').doc(user.uid).set(userData);
        }
      }

      // Step 6: Save in redux
      dispatch(setStateKey({ key: 'token', value: token }));
      dispatch(setStateKey({ key: 'userData', value: userData }));
    } catch (error: any) {
      console.error('Facebook Login Error:', error);

      if (error.code === 'auth/account-exists-with-different-credential') {
        showError(
          'An account with this email already exists. Please sign in using your original method (Google or Email).',
        );
      } else if (error.message === 'User cancelled the login process') {
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

export default memo(SignInWithFacebook);

import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SocialButton from '../socialButton';
import { checkUserExistsByEmail } from '@utils/helper';
import { setStateKey } from '@redux/slices/AuthSlice';
import { ICONS } from '@assets/index';
import { showError } from '@utils/toast';
import messaging from '@react-native-firebase/messaging';

interface SignInWithGoogleProps {
  setLoading: (loading: boolean) => void;
}

const SignInWithGoogle: React.FC<SignInWithGoogleProps> = ({ setLoading }) => {
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Step 1: Check Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Step 2: Sign out previous session (optional, ensures fresh login)
      await GoogleSignin.signOut();

      // Step 3: Start Google Sign-In
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin?.getTokens();
      if (!idToken) {
        throw new Error('ID token is missing');
      }

      // Step 4: Create credential & sign in with Firebase
      const credential = GoogleAuthProvider.credential(idToken);
      const authInstance = getAuth();
      const result = await signInWithCredential(authInstance, credential);

      const user = result.user;
      const userExists = await checkUserExistsByEmail(user.email);

      const userData = {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email,
        profileImage: user.photoURL || '',
        provider: 'google',
        createdAt: new Date().toISOString(),
      };

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
      dispatch(setStateKey({ key: 'token', value: idToken }));
      dispatch(setStateKey({ key: 'userData', value: userData }));
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      // ✅ Handle specific Firebase errors
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Fetch available sign-in methods for the email
        const email = error.customData?.email;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(getAuth(), email);
          const provider = methods.includes('password')
            ? 'Email & Password'
            : methods[0] || 'another provider';

          showError(
            `An account with this email already exists. Please sign in using ${provider} instead of Google.`,
          );
        } else {
          showError(
            'An account with this email already exists. Please try another sign-in method.',
          );
        }
      } else if (error.message.includes('Sign in action cancelled')) {
        // Silent exit for user cancellation
        return;
      } else if (error.code === 'auth/network-request-failed') {
        showError(
          'Network error. Please check your internet connection and try again.',
        );
      } else {
        // Generic fallback error
        showError(
          'There was an issue signing you in with Google. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SocialButton
      icon={ICONS.Google}
      onPress={handleGoogleLogin}
      accessibilityLabel="Login with Google"
      testID="google-login"
    />
  );
};

export default memo(SignInWithGoogle);

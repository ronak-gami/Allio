import React from 'react';
import { useDispatch } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SocialButton from '../socialButton';
import { checkUserExistsByEmail } from '@utils/helper';
import { setStateKey } from '@redux/slices/AuthSlice';
import { ICONS } from '@assets/index';
import messaging from '@react-native-firebase/messaging';
interface SignInWithGoogleProps {
  setLoading: (loading: boolean) => void;
}

const SignInWithGoogle: React.FC<SignInWithGoogleProps> = ({ setLoading }) => {
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      await GoogleSignin.signOut();
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) {
        throw new Error('ID token is missing');
      }
      const credential = GoogleAuthProvider.credential(idToken);
      const auth = getAuth();
      const result = await signInWithCredential(auth, credential);
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
        const fcmToken = await messaging().getToken();
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
    } catch (error) {
      console.error('Google Sign-In Error:', error);
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

export default SignInWithGoogle;

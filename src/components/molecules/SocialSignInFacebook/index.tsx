import React from 'react';
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

const SignInWithFacebook = () => {
  const dispatch = useDispatch();

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }
      const facebookCredential = FacebookAuthProvider.credential(
        data.accessToken,
      );
      const userCredential = await signInWithCredential(
        getAuth(),
        facebookCredential,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      const userExists = await checkUserExistsByEmail(user.email);
      const userData = {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email,
        profileImage: user.photoURL || '',
        provider: 'facebook',
        createdAt: new Date().toISOString(),
      };
      if (!userExists) {
        await firestore().collection('users').doc(user.uid).set(userData);
      }
      dispatch(setStateKey({ key: 'token', value: token }));
      dispatch(setStateKey({ key: 'userData', value: userData }));
    } catch (error) {
      console.error('Facebook Login Error:', error);
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

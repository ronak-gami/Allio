import React, { useState } from 'react';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import {
  getAuth,
  FacebookAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { Image } from 'react-native';
import { useDispatch } from 'react-redux';
import styles from './style';
import { setStateKey } from 'src/redux/slices/AuthSlice';
import Button from '@components/atoms/Button';
import { ICONS } from '@assets/index';

const FacebookButton = ({ onLoginSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);

      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      // Get the access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      // Create a Firebase credential with the token
      const facebookCredential = FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(
        getAuth(),
        facebookCredential,
      );
      const user = userCredential.user;

      const token = await user.getIdToken();
      dispatch(setStateKey({ key: 'token', value: token }));
      dispatch(setStateKey({ key: 'userData', value: user }));

      onLoginSuccess?.(user);
    } catch (error) {
      console.error('Facebook Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      title="Continue with Facebook"
      prefixLogo={<Image source={ICONS.FaceBook} style={styles.iconStyle} />}
      onPress={handleFacebookLogin}
      loading={loading}
      bgColor="#3b5998"
      style={styles.button}
    />
  );
};

export default FacebookButton;

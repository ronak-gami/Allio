import React, { useState } from 'react';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import {
  getAuth,
  FacebookAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { ICONS } from '@assets/index';
import Button from '@components/atoms/Button';
import { setStateKey } from '@redux/slices/AuthSlice';
import useStyle from './style';

const FacebookButton = ({ onLoginSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const styles = useStyle();

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);

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
    />
  );
};

export default FacebookButton;

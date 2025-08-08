import React, { memo } from 'react';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  GithubAuthProvider,
  signInWithCredential,
  getAuth,
} from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { ICONS } from '@assets/index';
import SocialButton from '../socialButton';
import { checkUserExistsByEmail } from '@utils/helper';
import { setStateKey } from '@redux/slices/AuthSlice';

const GITHUB_CLIENT_ID = 'Ov23liBFofdatcwtoX8i';
const GITHUB_CLIENT_SECRET = 'd45c27ce041a53adf538d3c786e044c7f1c96637';
const REDIRECT_URI = 'https://allio-cd2b5.firebaseapp.com/__/auth/handler';

const SignInWithGitHub = () => {
  const dispatch = useDispatch();

  const fetchGitHubOAuthCode = async (
    authUrl: string,
  ): Promise<{ code: string }> => {
    return new Promise((resolve, reject) => {
      const handleUrl = (event: { url: string }) => {
        const url = event.url;
        try {
          const parsedUrl = new URL(url);
          const code = parsedUrl.searchParams.get('code');
          if (code) {
            resolve({ code });
          } else {
            reject(new Error('No code found in redirect URL'));
          }
        } catch (e) {
          reject(new Error('Failed to parse redirect URL'));
        }
        Linking.removeAllListeners('url');
      };

      Linking.addEventListener('url', handleUrl);
      Linking.openURL(authUrl).catch(reject);
    });
  };

  const handleGitHubLogin = async () => {
    try {
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI,
      )}&scope=user:email`;

      const { code } = await fetchGitHubOAuthCode(authUrl);

      const tokenRes = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
          }),
        },
      );
      const { access_token } = await tokenRes.json();
      if (!access_token) throw new Error('No GitHub access token');

      const credential = GithubAuthProvider.credential(access_token);
      const userCred = await signInWithCredential(getAuth(), credential);
      const user = userCred.user;

      const userExists = await checkUserExistsByEmail(user.email);
      const userData = {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email,
        profileImage: user.photoURL || '',
        provider: 'github',
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
      const token = await user?.getIdToken();
      dispatch(setStateKey({ key: 'token', value: token }));
      dispatch(setStateKey({ key: 'userData', value: userData }));
    } catch (err) {
      console.error('GitHub login error:', err);
    }
  };

  return (
    <SocialButton
      icon={ICONS.Github}
      onPress={handleGitHubLogin}
      accessibilityLabel="Login with GitHub"
      testID="github-login"
    />
  );
};

export default memo(SignInWithGitHub);

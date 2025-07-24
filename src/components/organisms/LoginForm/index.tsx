import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Input from '../../atoms/Input';
import PasswordField from '../../molecules/PasswordFields';
import Button from '../../atoms/Button';
import { loginValidationSchema } from '../../../utils/validationSchema';
import { ICONS } from '../../../assets';
import styles from './style';
import Text from '../../atoms/Text';
import RememberForgot from '../../molecules/RememberForget';
import { useNavigation } from '@react-navigation/native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import {
  getAuth,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setStateKey } from '../../../redux/slices/AuthSlice';
import { Formik } from 'formik';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { checkUserExistsByEmail, getAllUsers } from '../../../utils/helper';

const LoginForm = () => {
  const navigation = useNavigation();
  const [remember, setRemember] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const auth = getAuth();
  const dispatch = useDispatch();

  const handleLogin = async (values: typeof initialValues) => {
    try {
      const exists = await checkUserExistsByEmail(values.email);
      if (!exists) {
        console.warn('User does not exist in Firestore collection!');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      const user = userCredential.user;
      if (user) {
        const token = await user.getIdToken();
        console.log('Token:', token);
        dispatch(setStateKey({ key: 'token', value: token }));

        const allUsers = await getAllUsers();
        console.log('All Users:', allUsers);
      }
    } catch (error) {
      console.error('Error into handleLogin :- ', error);
    }
  };

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
      console.log('user: ', user);
      const token = await user.getIdToken();
      dispatch(setStateKey({ key: 'token', value: token }));
      dispatch(setStateKey({ key: 'userData', value: user }));
    } catch (error) {
      console.error('Facebook Login Error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) throw new Error('ID token is missing');
      const credential = GoogleAuthProvider.credential(idToken);
      const auth = getAuth();
      const result = await signInWithCredential(auth, credential);
      const user = result.user;

      dispatch(setStateKey({ key: 'token', value: idToken }));
      dispatch(setStateKey({ key: 'userData', value: user }));

      console.log('Firebase User:', user);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text label="login" style={styles.title} type="bold" />
      <Text label="login_subtitle" style={styles.subtitle} />

      <View style={styles.inputContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              <Input
                placeholder="email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email ? errors.email : ''}
              />
              <PasswordField
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password ? errors.password : ''}
              />
              <RememberForgot
                remember={remember}
                onCheckboxPress={() => setRemember(!remember)}
              />
              <Button
                title="login"
                onPress={handleSubmit as () => void}
                style={styles.loginButton}
              />
            </>
          )}
        </Formik>
      </View>

      <View style={styles.socialButtonsWrapper}>
        <Text style={styles.socialSignInText}>Social Sign-In</Text>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleFacebookLogin}>
            <Image source={ICONS.FaceBook} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGoogleLogin}>
            <Image source={ICONS.Google} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('GitHub Login')}>
            <Image source={ICONS.Github} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('LinkedIn Login')}>
            <Image source={ICONS.LinkedIn} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.dividerContainer}>
          <Text label="no_account" style={styles.orText} />
          <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
            <Text label="register" style={styles.signUpText} type="semibold" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;

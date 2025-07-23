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
import {
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setStateKey } from '../../../redux/slices/AuthSlice';
import { Formik } from 'formik';
import FacebookButton from '../../molecules/FacebookButton';
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
      console.log('Login Function called');
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
      }
    } catch (error) {
      console.error('Error into handleLogin :- ', error);
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
          {/* <TouchableOpacity onPress={() => console.log('Facebook Login')}>
            <Image source={ICONS.FaceBook} style={styles.icon} />
          </TouchableOpacity> */}
          <FacebookButton />
          <TouchableOpacity onPress={() => console.log('Google Login')}>
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

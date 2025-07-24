import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Input from '../../atoms/Input';
import PasswordField from '../../molecules/PasswordFields';
import Button from '../../atoms/Button';
import useValidation from '../../../utils/validationSchema';
import { ICONS } from '../../../assets';
import styles from './style';
import Text from '../../atoms/Text';
import RememberForgot from '../../molecules/RememberForget';
import { useNavigation } from '@react-navigation/native';
import {
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setStateKey } from '../../../redux/slices/AuthSlice';
import { Formik } from 'formik';
import { checkUserExistsByEmail, getAllUsers } from '../../../utils/helper';
import { AUTH } from '../../../utils/constant';
import SignInWithFacebook from '../../molecules/SocialSignInFacebook';
import SignInWithGoogle from '../../molecules/SocialSignInGoogle';

const LoginForm = () => {
  const navigation = useNavigation();
  const [remember, setRemember] = useState(false);
  const { loginValidationSchema } = useValidation();
  const dispatch = useDispatch();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = async (values: typeof initialValues) => {
    try {
      const exists = await checkUserExistsByEmail(values.email);
      if (!exists) {
        console.warn('User does not exist in Firestore collection!');
        return;
      }

      const { getAuth } = require('@react-native-firebase/auth');
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      const user = userCredential.user;
      if (user) {
        const token = await user.getIdToken();
        dispatch(setStateKey({ key: 'token', value: token }));

        const allUsers = await getAllUsers();
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
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
          <SignInWithFacebook />
          <SignInWithGoogle />
        </View>
        <View style={styles.dividerContainer}>
          <Text label="no_account" style={styles.orText} />
          <Pressable onPress={() => navigation.navigate(AUTH.Register)}>
            <Text label="register" style={styles.signUpText} type="semibold" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;

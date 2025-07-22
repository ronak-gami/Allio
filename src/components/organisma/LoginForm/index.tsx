import React, {useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Input from '../../atoms/Input';
import PasswordField from '../../molecules/PasswordFields';
import Button from '../../atoms/Button';
import {loginValidationSchema} from '../../../utils/validationSchema';
import {ICONS} from '../../../assets';
import styles from './style';
import {Text} from 'react-native-paper';
import RememberForgot from '../../molecules/RememberForget';
import {useNavigation} from '@react-navigation/native';

const LoginForm = () => {
  const navigation: any = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    try {
      await loginValidationSchema.validate(
        {email, password},
        {abortEarly: false},
      );
      console.log({email, password});
    } catch (err: any) {
      if (err.inner) {
        err.inner.forEach((validationError: any) => {
          if (validationError.path === 'email')
            setEmailError(validationError.message);
          if (validationError.path === 'password')
            setPasswordError(validationError.message);
        });
      }
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>
        Welcome back! Please login to your account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
        />

        <PasswordField
          value={password}
          onChangeText={setPassword}
          error={passwordError}
        />
        <RememberForgot
          remember={remember}
          onCheckboxPress={() => setRemember(!remember)}
        />
      </View>
      <View style={styles.socialButtonsWrapper}>
        <Button
          title="Login"
          onPress={handleLogin}
          style={styles.loginButton}
        />
        <Button
          title="Continue with Facebook"
          prefixLogo={
            <Image source={ICONS.FaceBook} style={styles.iconStyle} />
          }
          onPress={() => console.log('Facebook Login')}
          bgColor="#3b5998"
          style={styles.button}
        />
        <Button
          title="Continue with Google"
          prefixLogo={<Image source={ICONS.Google} style={styles.iconStyle} />}
          onPress={() => console.log('Google Login')}
          bgColor="#DB4437"
          style={styles.button}
        />
        <Button
          title="Continue with GitHub"
          prefixLogo={<Image source={ICONS.Github} style={styles.iconStyle} />}
          onPress={() => console.log('GitHub Login')}
          bgColor="#24292e"
          style={styles.button}
        />
        <Button
          title="Continue with LinkedIn"
          prefixLogo={
            <Image source={ICONS.LinkedIn} style={styles.iconStyle} />
          }
          onPress={() => console.log('LinkedIn Login')}
          bgColor="#0077b5"
          style={styles.button}
        />

        <View style={styles.dividerContainer}>
          <Text style={styles.orText}>Do not have an Account ?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.signUpText}>Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;

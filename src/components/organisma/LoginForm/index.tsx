import React, {useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Input from '../../atoms/Input';
import PasswordField from '../../molecules/PasswordFields';
import Button from '../../atoms/Button';
import {loginValidationSchema} from '../../../utils/validationSchema';
import {ICONS} from '../../../assets';
import styles from './style';
import Text from '../../atoms/Text'; // ✅ Use your custom Text
import RememberForgot from '../../molecules/RememberForget';
import {useNavigation} from '@react-navigation/native';
import CustomDropdown from '../../atoms/Dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {setLanguage} from '../../../redux/slices/languageSlice';
import {toggleTheme} from '../../../redux/slices/ThemeSlice';
import {RootState} from '../../../redux/store';
const languages = [
  {label: 'English', value: 'en'},
  {label: 'हिंदी', value: 'hi'},
  {label: 'ગુજરાતી', value: 'gu'},
];

const LoginForm = () => {
  const navigation: any = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [remember, setRemember] = useState(false);

  const dispatch = useDispatch();
  const {t} = useTranslation();

  const currentLanguage = useSelector(
    (state: RootState) => state.language.language,
  );

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
    dispatch(toggleTheme());
  };

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
      <Text label="login" style={styles.title} type="bold" />
      <Text label="login_subtitle" style={styles.subtitle} />

      <View style={styles.inputContainer}>
        <Input
          placeholder="email"
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
          title="login"
          onPress={handleLogin}
          style={styles.loginButton}
        />

        <Button
          title="continue_facebook"
          prefixLogo={
            <Image source={ICONS.FaceBook} style={styles.iconStyle} />
          }
          onPress={() => console.log('Facebook Login')}
          bgColor="#3b5998"
          style={styles.button}
        />

        <Button
          title="continue_google"
          prefixLogo={<Image source={ICONS.Google} style={styles.iconStyle} />}
          onPress={() => console.log('Google Login')}
          bgColor="#DB4437"
          style={styles.button}
        />

        <Button
          title="continue_github"
          prefixLogo={<Image source={ICONS.Github} style={styles.iconStyle} />}
          onPress={() => console.log('GitHub Login')}
          bgColor="#24292e"
          style={styles.button}
        />

        <Button
          title="continue_linkedin"
          prefixLogo={
            <Image source={ICONS.LinkedIn} style={styles.iconStyle} />
          }
          onPress={() => console.log('LinkedIn Login')}
          bgColor="#0077b5"
          style={styles.button}
        />

        <View style={styles.dividerContainer}>
          <Text label="no_account" style={styles.orText} />
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}>
            <Text label="register" style={styles.signUpText} type="semibold" />
          </TouchableOpacity>
        </View>

        <CustomDropdown
          label={t('select_language')}
          data={languages.map(lang => lang.label)}
          selectedValue={
            languages.find(lang => lang.value === currentLanguage)?.label || ''
          }
          onSelect={label => {
            const selected = languages.find(lang => lang.label === label);
            if (selected) {
              handleLanguageChange(selected.value);
            }
          }}
        />
      </View>
    </View>
  );
};

export default LoginForm;

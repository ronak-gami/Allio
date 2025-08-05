import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import { useTranslation } from 'react-i18next';
import { RootState } from '@redux/store';

import Text from '@components/atoms/Text';
import CustomDropdown from '@components/atoms/Dropdown';
import Button from '@components/atoms/Button';
import { setLanguage } from '@redux/slices/languageSlice';
import { toggleTheme } from '@redux/slices/ThemeSlice';
import { languages } from '@utils/helper';
import { useTheme } from '@react-navigation/native';
import useStyle from './style';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { logout } from '@redux/slices/AuthSlice';

const More: React.FC = () => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const currentLanguage = useSelector(
    (state: RootState) => state.language.language,
  );
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  useEffect(() => {
    crashlytics().log('MoreScreen mounted');
    const trace = perf().newTrace('more_screen_load');
    trace.start();
    return () => {
      trace.stop();
    };
  }, []);

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    try {
      const authInstance = getAuth();
      const currentUser = authInstance.currentUser;

      if (currentUser) {
        await firestore().collection('users').doc(currentUser.uid).update({
          fcmToken: firestore.FieldValue.delete(),
          fcmUpdatedAt: firestore.FieldValue.delete(),
        });

        await authInstance.signOut();
        dispatch(logout());
      }
    } catch (error) {
      console.error('Logout Error:', error);
      crashlytics().recordError(error as Error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>More Screens</Text>
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
      <Button
        title={isDarkMode ? ' Switch to Light Mode' : ' Switch to Dark Mode'}
        onPress={handleThemeToggle}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default More;

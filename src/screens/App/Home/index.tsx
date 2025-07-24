import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../redux/store';
import { setLanguage } from '../../../redux/slices/languageSlice';
import CustomDropdown from '../../../components/atoms/Dropdown';
import Text from '../../../components/atoms/Text';
import Button from '../../../components/atoms/Button';
import { LightTheme, DarkTheme } from '../../../utils/themes';
import { toggleTheme } from '../../../redux/slices/ThemeSlice';
import useStyle from './style';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'हिंदी', value: 'hi' },
  { label: 'ગુજરાતી', value: 'gu' },
];

const HomeScreen: React.FC = () => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const currentLanguage = useSelector(
    (state: RootState) => state.language.language,
  );
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const theme = isDarkMode ? DarkTheme : LightTheme;

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text
        label={t('home_title')}
        style={[styles.title, { color: theme.colors.text }]}
      />

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
        title={
          isDarkMode ? '🌞 Switch to Light Mode' : '🌙 Switch to Dark Mode'
        }
        onPress={handleThemeToggle}
        style={{ backgroundColor: theme.colors.primary }}
        textStyle={{ color: isDarkMode ? '#000000' : '#FFFFFF' }}
      />
    </View>
  );
};

export default HomeScreen;

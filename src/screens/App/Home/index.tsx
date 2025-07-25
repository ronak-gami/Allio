import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useStyle from './style';
import Text from '@components/atoms/Text';
import CustomDropdown from '@components/atoms/Dropdown';
import Button from '@components/atoms/Button';
import { RootState } from '@redux/store';
import { setLanguage } from '@redux/slices/languageSlice';
import { toggleTheme } from '@redux/slices/ThemeSlice';
import { languages } from '@utils/helper';
import { COLORS } from '@utils/color';

const HomeScreen: React.FC = () => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const currentLanguage = useSelector(
    (state: RootState) => state.language.language,
  );
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Text
        label={t('home_title')}
        style={[styles.title, { color: COLORS.text }]}
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
        title={isDarkMode ? ' Switch to Light Mode' : ' Switch to Dark Mode'}
        onPress={handleThemeToggle}
        style={{ backgroundColor: COLORS.primary }}
        textStyle={{ color: isDarkMode ? '#000000' : '#FFFFFF' }}
      />
    </View>
  );
};

export default HomeScreen;

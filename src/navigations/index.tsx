import React, { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import i18n from '../assets/i18n';
import { setDarkMode } from '@redux/slices/ThemeSlice';
import AuthNavigator from './Auth';
import HomeNavigator from './App';
import colors from '@assets/theme';
import Splash from '@screens/Auth/Splash';

const lightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    ...colors.light,
  },
};

const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    ...colors.dark,
  },
};

const StackNavigator: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const language = useSelector((state: RootState) => state.language.language);
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    dispatch(setDarkMode(systemColorScheme === 'dark'));
  }, [dispatch, systemColorScheme]);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const appTheme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode],
  );

  if (isSplashVisible) {
    return (
      <NavigationContainer>
        <Splash />
      </NavigationContainer>
    );
  }
 

  return (
    <NavigationContainer theme={appTheme}>
      {token ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default StackNavigator;

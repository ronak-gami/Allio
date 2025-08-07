import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import Splash from '@screens/Auth/Splash';
import { useColorScheme } from 'react-native';
import { setDarkMode } from '../redux/slices/ThemeSlice';
import i18n from '../assets/i18n';
import { DefaultTheme } from '@react-navigation/native';
import colors from '@assets/theme';
import analytics from '@react-native-firebase/analytics';

import AuthNavigator from './Auth';
import HomeNavigator from './App';
import { RootState } from '../redux/store';

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
  const token = useSelector((s: RootState) => s.auth.token);

  const isDarkMode = useSelector((s: RootState) => s.theme.isDarkMode);
  const language = useSelector((s: RootState) => s.language.language);
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();

  const [splashVisible, setSplashVisible] = useState<boolean>(true);
  const navigationRef = useRef<any>(null);
  const routeNameRef = useRef<string>();
  useEffect(() => {
    dispatch(setDarkMode(systemColorScheme === 'dark'));
  }, [dispatch, systemColorScheme]);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const appTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <>
      <NavigationContainer
        theme={appTheme}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        }}
        onStateChange={async () => {
          const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
          if (routeNameRef.current !== currentRoute && currentRoute) {
            await analytics().logScreenView({
              screen_name: currentRoute,
              screen_class: currentRoute,
            });
            routeNameRef.current = currentRoute;
          }
        }}>
        {splashVisible ? (
          <Splash />
        ) : token ? (
          <HomeNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </>
  );
};

export default StackNavigator;

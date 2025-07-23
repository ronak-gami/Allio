import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from '../screens/splash';
import HomeNavigator from './HomeNavigator';
import AuthNavigator from './AuthNavigator';
import { DarkTheme, LightTheme } from '../utils/themes';
import { RootState } from '../redux/store';
import { setDarkMode } from '../redux/slices/ThemeSlice';

const StackNavigator: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    dispatch(setDarkMode(colorScheme === 'dark'));
  }, [colorScheme, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) return <SplashScreen />;

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : LightTheme}>
      {token ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default StackNavigator;

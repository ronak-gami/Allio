import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  NavigationContainer,
  LinkingOptions,
  DefaultTheme,
} from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useColorScheme } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';

import Splash from '@screens/Auth/Splash';
import AuthNavigator from './Auth';
import HomeNavigator from './App';
import { RootState } from '../redux/store';
import { BottomSheetProvider } from '../context/BottomSheetContext';
import { monitorOnlineStatus } from '@utils/helper';
import { navigationRef, getCurrentRouteName } from './navigationRef';
import { setDarkMode } from '../redux/slices/ThemeSlice';
import i18n from '../assets/i18n';
import colors from '@assets/theme';
import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from '@assets/theme/tamagui.config';
import DeepLinkManager from '@services/DeepLinkManager';
// import tamaguiConfig from '../assets/theme/tamagui.config';

const linking: LinkingOptions<any> = {
  prefixes: ['allio://', 'https://allio-app-bxwta.ondigitalocean.app'],
  config: {
    screens: {
      ChatDetailsScreen: {
        path: 'm/:sharedMediaId',
        parse: {
          sharedMediaId: (id: string) => id,
          email: (email: string) => decodeURIComponent(email).toLowerCase(),
        },
      },
      Profile: {
        path: 'user/:email',
        parse: {
          email: (email: string) => decodeURIComponent(email).toLowerCase(),
        },
      },
    },
  },
};

const lightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: { ...DefaultTheme.colors, ...colors.light },
};

const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: { ...DefaultTheme.colors, ...colors.dark },
};

// 🔹 Outside helper functions
function handleNavigationReady(
  routeNameRef: React.MutableRefObject<string | undefined>,
  navigationSpanRef: React.MutableRefObject<Sentry.Span | undefined>,
  screenSpanRef: React.MutableRefObject<Sentry.Span | undefined>,
) {
  const initial = getCurrentRouteName();
  routeNameRef.current = initial;

  navigationSpanRef.current = Sentry.startInactiveSpan({
    name: 'App Navigation',
    op: 'navigation',
  });

  if (initial) {
    screenSpanRef.current = Sentry.startInactiveSpan({
      name: initial,
      op: 'screen',
      parentSpan: navigationSpanRef.current,
    });

    Sentry.setTag('current_screen', initial);
    Sentry.setContext('navigation', {
      current_screen: initial,
      previous_screen: null,
    });

    Sentry.captureMessage(`User opened ${initial} screen`, 'info');
  }
}

async function handleNavigationStateChange(
  routeNameRef: React.MutableRefObject<string | undefined>,
  navigationSpanRef: React.MutableRefObject<Sentry.Span | undefined>,
  screenSpanRef: React.MutableRefObject<Sentry.Span | undefined>,
) {
  try {
    const currentRoute = getCurrentRouteName();

    if (currentRoute && routeNameRef.current !== currentRoute) {
      const previous = routeNameRef.current;

      screenSpanRef.current?.end();

      screenSpanRef.current = Sentry.startInactiveSpan({
        name: currentRoute,
        op: 'screen',
        parentSpan: navigationSpanRef.current,
      });

      await analytics().logScreenView({
        screen_name: currentRoute,
        screen_class: currentRoute,
      });

      Sentry.addBreadcrumb({
        category: 'navigation',
        message: `Navigated to ${currentRoute}`,
        level: 'info',
      });

      Sentry.setTag('current_screen', currentRoute);
      Sentry.setContext('navigation', {
        current_screen: currentRoute,
        previous_screen: previous,
      });

      Sentry.captureMessage(
        `User navigated from ${previous} to ${currentRoute}`,
        'info',
      );

      routeNameRef.current = currentRoute;
    }
  } catch (e) {
    Sentry.captureException(e);
  }
}

const StackNavigator: React.FC = () => {
  const token = useSelector((s: RootState) => s.auth.token);
  const isDarkMode = useSelector((s: RootState) => s.theme.isDarkMode);
  const language = useSelector((s: RootState) => s.language.language);
  const myEmail = useSelector((s: RootState) => s.auth.userData?.email);

  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const [splashVisible, setSplashVisible] = useState(true);

  // Refs
  const routeNameRef = useRef<string | undefined>();
  const navigationSpanRef = useRef<Sentry.Span | undefined>();
  const screenSpanRef = useRef<Sentry.Span | undefined>();

  useEffect(() => {
    dispatch(setDarkMode(systemColorScheme === 'dark'));
  }, [dispatch, systemColorScheme]);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    const t = setTimeout(() => setSplashVisible(false), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    monitorOnlineStatus(myEmail);
    if (myEmail) {
      Sentry.setUser({ email: myEmail });
    }
  }, [myEmail]);

  useEffect(() => {
    return () => {
      try {
        screenSpanRef.current?.end();
        navigationSpanRef.current?.end();
      } catch {}
    };
  }, []);

  const appTheme = isDarkMode ? darkTheme : lightTheme;

  // 🔹 Memoized handlers
  const onReady = useCallback(
    () => handleNavigationReady(routeNameRef, navigationSpanRef, screenSpanRef),
    [],
  );

  const onStateChange = useCallback(
    () =>
      handleNavigationStateChange(
        routeNameRef,
        navigationSpanRef,
        screenSpanRef,
      ),
    [],
  );

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={isDarkMode ? 'dark' : 'light'}>
      <Theme name={isDarkMode ? 'dark' : 'light'}>
        <NavigationContainer
          linking={linking}
          theme={appTheme}
          ref={navigationRef}
          onReady={onReady}
          onStateChange={onStateChange}>
          <DeepLinkManager />
          <BottomSheetProvider>
            {splashVisible ? (
              <Splash />
            ) : token ? (
              <HomeNavigator />
            ) : (
              <AuthNavigator />
            )}
          </BottomSheetProvider>
        </NavigationContainer>
      </Theme>
    </TamaguiProvider>
  );
};

export default StackNavigator;

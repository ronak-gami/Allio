import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native'; // Sentry import

import { StyleSheet, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { store, persistor } from './src/redux/store';
import StackNavigator from './src/navigations';
import { WEB_CLIENT_ID } from '@utils/constant';
import { initNotifications } from '@utils/notification';
import {
  extractShareId,
  extractShareEmail,
  resolveSharedMedia,
  extractProfileEmail,
} from '@utils/deepLinking';
import { getUserData } from '@utils/helper';
import { navigationRef } from './src/navigations/navigationRef';

Sentry.init({
  dsn: 'https://61501c2e99978ee58ca285d730991b4d@o4509948781920256.ingest.us.sentry.io/4509948783558656',
  tracesSampleRate: 1.0, // performance monitoring
  enableAutoSessionTracking: true,

  profilesSampleRate: 1.0,
  enableAutoPerformanceTracing: true,

  // Optional integrations already present
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  parentSpanIsAlwaysRootSpan: false,

  // Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
});

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });

    (async () => {
      await initNotifications();
    })();

    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('Notification opened app from background:', remoteMessage);
      },
    );

    messaging().getInitialNotification();

    return () => {
      unsubscribeBackground();
    };
  }, []);

  useEffect(() => {
    const handleUrl = async (url?: string | null) => {
      try {
        const profileEmail = extractProfileEmail(url);
        if (profileEmail) {
          if (navigationRef.isReady()) {
            navigationRef.navigate('Profile', { email: profileEmail });
          }
          return;
        }

        const id = extractShareId(url);
        if (!id) return;

        const rec = await resolveSharedMedia(id);
        if (!rec) return;

        const senderEmail = (
          rec.sender ||
          extractShareEmail(url) ||
          ''
        ).toLowerCase();

        let fullUser = null;
        if (senderEmail) {
          try {
            const profile = await getUserData(senderEmail);
            if (profile) {
              fullUser = {
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                mobileNo: profile.mobileNo,
                profileImage: profile.profileImage,
              };
            }
          } catch (e) {
            console.warn('Deep link getUserData failed:', e);
            Sentry.captureException(e); // Capture deep link errors
          }
        }

        const userParam =
          fullUser || (senderEmail ? { email: senderEmail } : undefined);

        const params = {
          sharedMediaId: rec.id,
          mediaUrl: rec.mediaUrl,
          type: rec.type,
          user: userParam,
          email: senderEmail,
        };

        if (navigationRef.isReady()) {
          const current = navigationRef.getCurrentRoute()?.name;
          if (current === 'ChatDetailsScreen') {
            navigationRef.navigate('ChatDetailsScreen', {
              merge: true,
              ...params,
            });
          } else {
            navigationRef.navigate('ChatDetailsScreen', params);
          }
        }
      } catch (e) {
        console.warn('resolveSharedMedia error', e);
        Sentry.captureException(e); // Capture errors
      }
    };

    Linking.getInitialURL()
      .then(handleUrl)
      .catch(err => Sentry.captureException(err));
    const sub = Linking.addEventListener('url', e => handleUrl(e.url));
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <PaperProvider>
          <PersistGate loading={null} persistor={persistor}>
            <StackNavigator />
            <Toast />
          </PersistGate>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

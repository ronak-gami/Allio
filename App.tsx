import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistor } from './src/redux/store';
import StackNavigator from './src/navigations';
import { WEB_CLIENT_ID } from '@utils/constant';
import { StyleSheet, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { initNotifications } from '@utils/notification';
import {
  extractShareId,
  extractShareEmail,
  resolveSharedMedia,
} from '@utils/deepLinking';
import { getUserData } from '@utils/helper';
import { navigationRef } from '@navigations/navigationRef';

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
      const id = extractShareId(url);
      if (!id) {
        return;
      }

      try {
        const rec = await resolveSharedMedia(id);
        if (!rec) {
          return;
        }

        // Prefer sender from record; fallback to email query param
        const senderEmail = (
          rec.sender ||
          extractShareEmail(url) ||
          ''
        ).toLowerCase();

        // Fetch full user profile (may return null)
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
      }
    };

    Linking.getInitialURL()
      .then(handleUrl)
      .catch(() => {});
    const sub = Linking.addEventListener('url', e => handleUrl(e.url));
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React, { useEffect, useRef } from 'react';
// import { Alert, PermissionsAndroid, Platform } from 'react-native';

import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ToastManager from 'toastify-react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import perf from '@react-native-firebase/perf';
// import notifee, { AndroidImportance } from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging';

import CustomNotification, {
  CustomToastRef,
} from '@components/atoms/CustomNotification';
import { useNotification } from '@hooks/index';

import { store, persistor } from './src/redux/store';
import StackNavigator from './src/navigations';

const App = () => {
  const customToastRef = useRef<CustomToastRef>(null);
  useNotification(customToastRef);

  // useEffect(() => {
  //   requestPermissions();
  //   const unsubscribe = messaging().onMessage(onMessageReceived); // Foreground

  //   return () => unsubscribe();
  // }, []);

  // async function requestPermissions() {
  //   if (Platform.OS === 'android' && Platform.Version >= 33) {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //     );

  //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //       Alert.alert('Notification permission denied');
  //     }
  //   } else {
  //     await notifee.requestPermission();
  //   }
  // }

  // async function onMessageReceived(remoteMessage) {
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //     importance: AndroidImportance.HIGH,
  //   });

  //   await notifee.displayNotification({
  //     title: remoteMessage.notification?.title || 'Foreground Message',
  //     body:
  //       remoteMessage.notification?.body ||
  //       'Received while app is in foreground',
  //     android: {
  //       channelId,
  //       smallIcon: 'ic_launcher',
  //     },
  //   });
  // }

  // useEffect(() => {
  //   handleNotificationFlow();
  // }, []);

  // const handleNotificationFlow = async () => {
  //   // Step 1: Ask for permission (Android 13+ or iOS)

  //   // Step 2: Create Android channel (required for Android O+)

  //   const channelId = await notifee.createChannel({
  //     id: 'default',

  //     name: 'Default Channel',

  //     importance: AndroidImportance.HIGH,
  //   });

  //   // Step 3: Display the notification

  //   await notifee.displayNotification({
  //     title: '🚀 Welcome!',

  //     body: 'This notification appears automatically on app launch.',

  //     android: {
  //       channelId,

  //       smallIcon: 'ic_launcher', // default app icon in res/mipmap

  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '299086233123-40u7rfe1tdb4q5m7341rtdqo5qabf7eu.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);
  useEffect(() => {
    crashlytics().log('App mounted');
    analytics().logAppOpen();
    // Optionally start a performance trace
    const trace = perf().newTrace('app_start');
    trace.start();
    return () => {
      trace.stop();
    };
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <PersistGate loading={null} persistor={persistor}>
          <CustomNotification ref={customToastRef} />
          <ToastManager
            position="bottom"
            theme="light"
            icons={{
              success: 'check-circle',
              error: 'error',
              info: 'info',
              warn: 'warning',
              default: 'notifications',
            }}
            iconFamily="MaterialIcons"
            iconSize={24}
          />
          <StackNavigator />
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
};

export default App;

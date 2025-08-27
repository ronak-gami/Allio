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
import { StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { onDisplayNotification } from '@utils/helper';

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });

    // 1. Get the FCM token
    const getFcmToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('Your Firebase Token is:', fcmToken);
        // This token is what you'd send to your server to target this device
      } else {
        console.log('Failed to get FCM token');
      }
    };

    getFcmToken();

    // 2. Listen for foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived in foreground!', remoteMessage);
      // Here we use the same handler to display the notification
      onDisplayNotification(remoteMessage?.data);
    });

    return unsubscribe;
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

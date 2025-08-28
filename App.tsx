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
import { initNotifications } from '@utils/notification';

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

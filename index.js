/**
 * @format
 */

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { onDisplayNotification } from '@utils/helper';

// Register background handler - This handles notifications when app is in background/killed
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    // Handle data-only messages
    if (remoteMessage.data) {
      await onDisplayNotification({
        title: remoteMessage.data.title || 'New Message',
        body: remoteMessage.data.body || 'You have a new message',
      });
    }
  } catch (error) {
    console.error('Background notification error:', error);
  }
});

AppRegistry.registerComponent(appName, () => App);

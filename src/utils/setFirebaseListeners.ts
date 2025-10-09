import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import {
  isFirebaseStreamVideoMessage,
  firebaseDataHandler,
  onAndroidNotifeeEvent,
  isNotifeeStreamVideoEvent,
} from '@stream-io/video-react-native-sdk';

export const setFirebaseListeners = () => {
  // Set up the background message handler for FCM
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Check if it's a Stream Video call notification
    if (isFirebaseStreamVideoMessage(remoteMessage)) {
      await firebaseDataHandler(remoteMessage.data);
    } else {
      // Handle your regular chat notifications
      console.log('Regular notification in background');
    }
  });

  // Handle foreground FCM messages
  messaging().onMessage(async remoteMessage => {
    if (isFirebaseStreamVideoMessage(remoteMessage)) {
      await firebaseDataHandler(remoteMessage.data);
    } else {
      // Handle your regular chat notifications
      console.log('Regular notification in foreground');
    }
  });

  // Notifee background event handler
  notifee.onBackgroundEvent(async event => {
    if (isNotifeeStreamVideoEvent(event)) {
      await onAndroidNotifeeEvent({ event, isBackground: true });
    } else {
      // Handle your regular notification actions
      switch (event.type) {
        case EventType.ACTION_PRESS:
          console.log('Action pressed:', event.detail);
          break;
        case EventType.PRESS:
          console.log('Notification pressed:', event.detail);
          break;
        default:
          break;
      }
    }
  });

  // Notifee foreground event handler
  notifee.onForegroundEvent(async event => {
    if (isNotifeeStreamVideoEvent(event)) {
      await onAndroidNotifeeEvent({ event, isBackground: false });
    } else {
      // Handle your regular notification actions
      switch (event.type) {
        case EventType.ACTION_PRESS:
          console.log('Action pressed:', event.detail);
          break;
        case EventType.PRESS:
          console.log('Notification pressed:', event.detail);
          break;
        default:
          break;
      }
    }
  });

  console.log('Firebase listeners setup complete');
};

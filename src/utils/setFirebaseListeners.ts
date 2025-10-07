import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import {
  isFirebaseStreamVideoMessage,
  firebaseDataHandler,
  onAndroidNotifeeEvent,
  isNotifeeStreamVideoEvent,
} from '@stream-io/video-react-native-sdk';

export const setFirebaseListeners = () => {
  console.log('Setting up Firebase listeners for Stream Video');

  // Set up the background message handler for FCM
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background FCM message received:', remoteMessage);

    // Check if it's a Stream Video call notification
    if (isFirebaseStreamVideoMessage(remoteMessage)) {
      console.log('Processing Stream Video message in background');
      await firebaseDataHandler(remoteMessage.data);
    } else {
      // Handle your regular chat notifications
      console.log('Regular notification in background');
    }
  });

  // Handle foreground FCM messages
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground FCM message received:', remoteMessage);

    if (isFirebaseStreamVideoMessage(remoteMessage)) {
      console.log('Processing Stream Video message in foreground');
      await firebaseDataHandler(remoteMessage.data);
    } else {
      // Handle your regular chat notifications
      console.log('Regular notification in foreground');
    }
  });

  // Notifee background event handler
  notifee.onBackgroundEvent(async event => {
    console.log('Notifee background event:', event);

    if (isNotifeeStreamVideoEvent(event)) {
      console.log('Processing Stream Video notifee event in background');
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
    console.log('Notifee foreground event:', event);

    if (isNotifeeStreamVideoEvent(event)) {
      console.log('Processing Stream Video notifee event in foreground');
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

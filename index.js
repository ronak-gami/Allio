/**
 * @format
 */

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { onDisplayNotification } from '@utils/helper';
import notifee, {
  EventType,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import {
  isFirebaseStreamVideoMessage,
  firebaseDataHandler,
  onAndroidNotifeeEvent,
  isNotifeeStreamVideoEvent,
} from '@stream-io/video-react-native-sdk';

// Ensure channel exists for headless/background (initNotifications not called yet)
async function ensureHeadlessChannel() {
  try {
    const channelId = 'chat_messages';
    const channels = await notifee.getChannels();
    if (!channels.find(c => c.id === channelId)) {
      await notifee.createChannel({
        id: channelId,
        name: 'Chat Messages',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        sound: 'default',
      });
    }
  } catch (e) {
    console.warn('ensureHeadlessChannel error', e);
  }
}

// Ensure incoming call channel exists
async function ensureIncomingCallChannel() {
  try {
    const channelId = 'stream_incoming_call';
    const channels = await notifee.getChannels();
    if (!channels.find(c => c.id === channelId)) {
      await notifee.createChannel({
        id: channelId,
        name: 'Incoming call notifications',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        sound: 'default',
        vibration: true,
        lightColor: '#00FF00',
      });
    }
  } catch (e) {
    console.warn('ensureIncomingCallChannel error', e);
  }
}

// Notifee background event handler
notifee.onBackgroundEvent(async event => {
  console.log('Notifee background event:', event);

  if (isNotifeeStreamVideoEvent(event)) {
    console.log('Processing Stream Video event in background');
    await onAndroidNotifeeEvent({ event, isBackground: true });
  } else {
    // Handle regular chat notifications
    switch (event.type) {
      case EventType.ACTION_PRESS:
        break;
      case EventType.PRESS:
        break;
      case EventType.DELIVERED:
      case EventType.DISMISSED:
      default:
        break;
    }
  }
});

// FCM background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);

  // Check if it's a Stream Video call
  if (isFirebaseStreamVideoMessage(remoteMessage)) {
    console.log('Stream Video call detected in background');
    await ensureIncomingCallChannel();
    await firebaseDataHandler(remoteMessage.data);
  } else {
    // Regular chat notification
    await ensureHeadlessChannel();
    await onDisplayNotification({
      title:
        remoteMessage.data?.title ||
        remoteMessage.notification?.title ||
        'New Message',
      body:
        remoteMessage.data?.body ||
        remoteMessage.notification?.body ||
        'You have a new message',
    });
  }
});

AppRegistry.registerComponent(appName, () => App);

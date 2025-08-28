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

// Notifee background event handler (removes warning)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  switch (type) {
    case EventType.ACTION_PRESS:
      // detail.pressAction.id, detail.notification
      // Handle action buttons if you add them later
      break;
    case EventType.PRESS:
      // User tapped notification body (deep-link logic can go here)
      break;
    case EventType.DELIVERED:
    case EventType.DISMISSED:
    default:
      break;
  }
});

// FCM data messages (background/killed)
messaging().setBackgroundMessageHandler(async remoteMessage => {
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
});

AppRegistry.registerComponent(appName, () => App);

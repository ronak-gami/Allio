import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { onDisplayNotification } from '@utils/helper';

let channelCreated = false;

const ensureChannel = async () => {
  if (channelCreated) return;
  await notifee.createChannel({
    id: 'chat_messages',
    name: 'Chat Messages',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
  });
  channelCreated = true;
};

export const initNotifications = async () => {
  try {
    await ensureChannel();

    // Foreground listener
    messaging().onMessage(async remoteMessage => {
      const title =
        remoteMessage.data?.title ||
        remoteMessage.notification?.title ||
        'New Message';
      const body =
        remoteMessage.data?.body ||
        remoteMessage.notification?.body ||
        'You have a new message';
      await onDisplayNotification({ title, body });
    });

    // When app opened from background by tapping (optional extra logic)
    messaging().onNotificationOpenedApp(async remoteMessage => {
      const title =
        remoteMessage.data?.title ||
        remoteMessage.notification?.title ||
        'New Message';
      const body =
        remoteMessage.data?.body ||
        remoteMessage.notification?.body ||
        'You have a new message';
      // Optionally avoid duplicate display if system already showed one
      await onDisplayNotification({ title, body });
    });

    // App cold start (user tapped a notification launching app)
    const initial = await messaging().getInitialNotification();
    if (initial) {
      const title =
        initial.data?.title || initial.notification?.title || 'New Message';
      const body =
        initial.data?.body ||
        initial.notification?.body ||
        'You have a new message';
      await onDisplayNotification({ title, body });
    }
  } catch (e) {
    console.error('Notification init error:', e);
  }
};

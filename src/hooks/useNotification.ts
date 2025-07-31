import { PermissionsAndroid } from 'react-native';
import { useEffect, RefObject } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { CustomToastRef } from '@components/atoms/CustomToast';

const useNotification = (toastRef: RefObject<CustomToastRef>) => {
  const requestUserPermission = async () => {
    try {
      const granted: 'granted' | 'denied' | 'never_ask_again' =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification Permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (error: any) {
      console.error('Failed to request notification permission:', error);
    }
  };

  const getToken = async () => {
    try {
      const token: string = await messaging().getToken();
      console.log('FCM Token:', token);
    } catch (error: any) {
      console.error('Failed to get FCM token:', error);
    }
  };

  useEffect(() => {
    requestUserPermission();
    getToken();

    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('FCM Message received in FOREGROUND:', remoteMessage);

        if (remoteMessage.notification) {
          toastRef.current?.show(
            `${remoteMessage.notification.title || 'Notification'}\n${
              remoteMessage.notification.body || ''
            }`,
            'success', // Or 'info', 'error' based on your needs
          );
        } else if (remoteMessage.data) {
          toastRef.current?.show(
            `Data-only message: ${JSON.stringify(remoteMessage.data)}`,
            'info',
          );
        }
      },
    );

    // 3. Handle Messages when App is Opened from a Quit State
    messaging()
      .getInitialNotification()
      .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (remoteMessage) {
          console.log('FCM Message opened app from QUIT state:', remoteMessage);
          if (remoteMessage.data?.screen) {
            console.log(`Maps to screen: ${remoteMessage.data.screen}`);
          }
        }
      });

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
          console.log(
            'FCM Notification caused app to open from BACKGROUND:',
            remoteMessage,
          );
          if (remoteMessage.data?.screen) {
            console.log(
              `Maps to screen from background tap: ${remoteMessage.data.screen}`,
            );
          }
        },
      );

    // Cleanup listeners when the component unmounts
    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, [toastRef]); // Add toastRef to dependency array
};

messaging().setBackgroundMessageHandler(
  async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log(
      'FCM Message handled in the BACKGROUND (via setBackgroundMessageHandler):',
      remoteMessage,
    );
  },
);
export default useNotification;

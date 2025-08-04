import { PermissionsAndroid } from 'react-native';
import { useEffect, RefObject } from 'react';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { CustomToastRef } from '@components/atoms/CustomNotification';
import { requestUserPermission } from '@utils/helper';

const useNotification = (toastRef: RefObject<CustomToastRef>) => {
  const getToken = async () => {
    try {
      const token: string = await messaging().getToken();
    } catch (error: any) {
      console.error('Failed to get FCM token:', error);
    }
  };

  useEffect(() => {
    // requestUserPermission();
    getToken();

    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
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
          if (remoteMessage.data?.screen) {
          }
        }
      });

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
          if (remoteMessage.data?.screen) {
          }
        },
      );

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, [toastRef]);
};

messaging().setBackgroundMessageHandler(
  async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {},
);
export default useNotification;

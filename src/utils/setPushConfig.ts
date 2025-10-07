import {
  StreamVideoClient,
  StreamVideoRN,
  User,
} from '@stream-io/video-react-native-sdk';
import notifee, {
  AndroidImportance,
  AndroidCategory,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STREAM_API_KEY } from './constant';
import api from '@api/index';

// Create the incoming call channel
const ensureIncomingCallChannel = async () => {
  try {
    const channelId = 'stream_incoming_call';
    const channels = await notifee.getChannels();
    if (!channels.find(c => c.id === channelId)) {
      await notifee.createChannel({
        id: channelId,
        name: 'Incoming call notifications',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        lightColor: '#00FF00',
      });
    }
  } catch (e) {
    console.warn('ensureIncomingCallChannel error', e);
  }
};

export const setPushConfig = async () => {
  // Ensure the channel exists before configuring push
  await ensureIncomingCallChannel();

  StreamVideoRN.setPushConfig({
    ios: {
      // add your push_provider_name for iOS that you have setup in Stream dashboard
      pushProviderName: __DEV__ ? 'apn-video-staging' : 'apn-video-production',
    },

    android: {
      // the name of android notification icon (Optional, defaults to 'ic_launcher')
      smallIcon: 'ic_notification',
      // add your push_provider_name for Android that you have setup in Stream dashboard
      pushProviderName: 'Allio',
      // configure the notification channel to be used for incoming calls for Android.
      incomingCallChannel: {
        id: 'stream_incoming_call',
        name: 'Incoming call notifications',
        // This is the advised importance of receiving incoming call notifications.
        // This will ensure that the notification will appear on-top-of applications.
        importance: AndroidImportance.HIGH,
        // optional: if you dont pass a sound, default ringtone will be used
        sound: 'default',
        vibration: true,
        lightColor: '#00FF00',
      },
      // configure the functions to create the texts shown in the notification
      // for incoming calls in Android.
      incomingCallNotificationTextGetters: {
        getTitle: (userName: string) => `Incoming call from ${userName}`,
        getBody: (_userName: string) => 'Tap to answer the call',
        getAcceptButtonTitle: () => 'Accept',
        getDeclineButtonTitle: () => 'Decline',
      },
      // Enable full-screen intent for incoming calls
      callNotificationOptions: {
        android: {
          fullScreenAction: {
            id: 'default',
          },
          category: AndroidCategory.CALL,
          ongoing: true,
          autoCancel: false,
        },
      },
    },

    // add the async callback to create a video client
    // for incoming calls in the background on a push notification
    createStreamVideoClient: async () => {
      const userId = await AsyncStorage.getItem('@userId');
      const userName = await AsyncStorage.getItem('@userName');
      if (!userId) return undefined;

      const tokenProvider = async () => {
        const tokenData = await api.GETSTREAM.getToken({ data: { userId } });
        if (tokenData?.data?.success && tokenData.data.token) {
          return tokenData.data.token;
        }
        throw new Error('No token retrieved from the API');
      };

      const user: User = { id: userId, name: userName };
      return StreamVideoClient.getOrCreateInstance({
        apiKey: STREAM_API_KEY,
        user,
        tokenProvider,
      });
    },
  });
};

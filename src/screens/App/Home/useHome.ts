import { useEffect } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { applyNotificationSettings, getUserData } from '@utils/helper';
import { requestNotifications } from 'react-native-permissions';
import api from '@api/index';

const useHome = () => {
  const auth = getAuth();

  const saveUserToFirestore = async (userId: string, userData: any) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .set(userData, { merge: true });
    } catch (error) {
      console.error('[Firestore] Error saving user:', error);
    }
  };

  const fetchAndStoreGetStreamToken = async (
    userId: string,
    userEmail: string,
  ) => {
    try {
      const data = await getUserData(userEmail);

      const tokenResponse = await api.GETSTREAM.getToken({
        data: { userId: data?.getStreamUserId },
      });

      if (tokenResponse?.data?.success && tokenResponse.data.token) {
        const tokenData = {
          getStreamToken: tokenResponse.data.token,
          getStreamTokenUpdatedAt: new Date().toISOString(),
        };

        await saveUserToFirestore(userId, tokenData);
        console.log('GetStream token saved successfully');
      }
    } catch (error) {
      console.error('Error fetching/storing GetStream token:', error);
    }
  };

  useEffect(() => {
    requestNotifications(['alert', 'sound']);

    const timeoutId = setTimeout(async () => {
      await applyNotificationSettings();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // GetStream token management
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser?.uid && currentUser?.email) {
      const checkAndFetchToken = async () => {
        try {
          const userDoc = await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();

          const userData = userDoc.data();

          // Only fetch token if it doesn't exist or is older than 24 hours
          const shouldFetchToken =
            !userData?.getStreamToken ||
            !userData?.getStreamTokenUpdatedAt ||
            new Date().getTime() -
              new Date(userData.getStreamTokenUpdatedAt).getTime() >
              24 * 60 * 60 * 1000;

          if (shouldFetchToken) {
            await fetchAndStoreGetStreamToken(
              currentUser.uid,
              currentUser.email,
            );
          }
        } catch (error) {
          console.error('Error checking GetStream token:', error);
        }
      };

      checkAndFetchToken();
    }
  }, [auth.currentUser]);

  return {};
};

export default useHome;

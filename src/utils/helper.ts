import { Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export const height = Dimensions.get('screen').height;
export const width = Dimensions.get('screen').width;
import { PermissionsAndroid, Platform } from 'react-native';
export const FONTS: Record<string, string> = {
  black: 'Montserrat-Black',
  bold: 'Montserrat-Bold',
  extraBold: 'Montserrat-ExtraBold',
  light: 'Montserrat-Light',
  extraLight: 'Montserrat-ExtraLight',
  medium: 'Montserrat-Medium',
  regular: 'Montserrat-Regular',
  semiBold: 'Montserrat-SemiBold',
  thin: 'Montserrat-Thin',
};

interface FirestoreUser {
  id: string;
  email?: string;
}

const getAllUsers = async (): Promise<FirestoreUser[]> => {
  try {
    const snapshot = await firestore().collection('users').get();

    const users: FirestoreUser[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    return [];
  }
};

const checkUserExistsByEmail = async (email: string): Promise<boolean> => {
  try {
    const querySnapshot = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    const exists = !querySnapshot.empty;
    return exists;
  } catch (error) {
    console.error('[Firestore] Error checking user existence:', error);
    return false;
  }
};

const updateUserInFirestore = async (
  userId: string,
  updatedData: Partial<FirestoreUser>,
): Promise<boolean> => {
  try {
    await firestore().collection('users').doc(userId).update(updatedData);

    return true;
  } catch (error) {
    console.error('[Firestore] Error updating user:', error);
    return false;
  }
};
const languages = [
  { label: 'English', value: 'en' },
  { label: 'हिंदी', value: 'hi' },
  { label: 'ગુજરાતી', value: 'gu' },
];
  const requestUserPermission = async () => {
    try {
      const granted: 'granted' | 'denied' | 'never_ask_again' =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {

      } else {
        
      }
    } catch (error: any) {
      console.error('Failed to request notification permission:', error);
    }
  };

export {
  getAllUsers,
  checkUserExistsByEmail,
  requestUserPermission,
  updateUserInFirestore,
  languages,
};

// import { Dimensions } from 'react-native';
// import firestore from '@react-native-firebase/firestore';

// export const height = Dimensions.get('screen').height;
// export const width = Dimensions.get('screen').width;

// export const FONTS = {
//   black: 'Montserrat-Black',
//   bold: 'Montserrat-Bold',
//   extraBold: 'Montserrat-ExtraBold',
//   light: 'Montserrat-Light',
//   extraLight: 'Montserrat-ExtraLight',
//   medium: 'Montserrat-Medium',
//   regular: 'Montserrat-Regular',
//   semiBold: 'Montserrat-SemiBold',
//   thin: 'Montserrat-Thin',
// };

// export const getAllUsers = async () => {
//   try {
//     console.log('[Firestore] Fetching all users...');
//     const snapshot = await firestore().collection('users').get();

//     const users = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     console.log(`[Firestore] Found ${users.length} users`);
//     return users;
//   } catch (error) {
//     console.error('[Firestore] Error fetching users:', error);
//     return [];
//   }
// };

// export const checkUserExistsByEmail = async email => {
//   try {
//     console.log(`[Firestore] Checking user with email: ${email}`);
//     const querySnapshot = await firestore()
//       .collection('users')
//       .where('email', '==', email)
//       .get();

//     const exists = !querySnapshot.empty;
//     console.log(`[Firestore] User exists: ${exists}`);
//     return exists;
//   } catch (error) {
//     console.error('[Firestore] Error checking user existence:', error);
//     return false;
//   }
// };

// export const updateUserInFirestore = async (userId, updatedData) => {
//   try {
//     console.log(`[Firestore] Updating user ${userId} with:`, updatedData);
//     await firestore().collection('users').doc(userId).update(updatedData);

//     console.log('[Firestore] User updated successfully');
//     return true;
//   } catch (error) {
//     console.error('[Firestore] Error updating user:', error);
//     return false;
//   }
// };

import { Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';

// Screen dimensions
export const height = Dimensions.get('screen').height;
export const width = Dimensions.get('screen').width;

// Font family mapping
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

// Define a type for Firestore user data
export interface FirestoreUser {
  id: string;
  email?: string;
  [key: string]: any; // Extendable for any user fields
}

// Get all users from Firestore
export const getAllUsers = async (): Promise<FirestoreUser[]> => {
  try {
    console.log('[Firestore] Fetching all users...');
    const snapshot = await firestore().collection('users').get();

    const users: FirestoreUser[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`[Firestore] Found ${users.length} users`);
    return users;
  } catch (error) {
    console.error('[Firestore] Error fetching users:', error);
    return [];
  }
};

// Check if user exists by email
export const checkUserExistsByEmail = async (
  email: string,
): Promise<boolean> => {
  try {
    console.log(`[Firestore] Checking user with email: ${email}`);
    const querySnapshot = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    const exists = !querySnapshot.empty;
    console.log(`[Firestore] User exists: ${exists}`);
    return exists;
  } catch (error) {
    console.error('[Firestore] Error checking user existence:', error);
    return false;
  }
};

// Update user by ID in Firestore
export const updateUserInFirestore = async (
  userId: string,
  updatedData: Partial<FirestoreUser>,
): Promise<boolean> => {
  try {
    console.log(`[Firestore] Updating user ${userId} with:`, updatedData);
    await firestore().collection('users').doc(userId).update(updatedData);

    console.log('[Firestore] User updated successfully');
    return true;
  } catch (error) {
    console.error('[Firestore] Error updating user:', error);
    return false;
  }
};

export const languages = [
  { label: 'English', value: 'en' },
  { label: 'हिंदी', value: 'hi' },
  { label: 'ગુજરાતી', value: 'gu' },
];

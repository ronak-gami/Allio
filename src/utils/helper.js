import { Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export const height = Dimensions.get('screen').height;
export const width = Dimensions.get('screen').width;

export const FONTS = {
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

export const getAllUsers = async () => {
  try {
    const snapshot = await firestore().collection('users').get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    return [];
  }
};

export const checkUserExistsByEmail = async email => {
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

export const updateUserInFirestore = async (userId, updatedData) => {
  try {
    await firestore().collection('users').doc(userId).update(updatedData);

    return true;
  } catch (error) {
    console.error('[Firestore] Error updating user:', error);
    return false;
  }
};

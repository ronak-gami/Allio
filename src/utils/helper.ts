import { Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  check,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

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

type AndroidPermissionType = 'all' | 'camera' | 'storage' | 'microphone';

interface AndroidPermissionResult {
  granted: boolean;
  results: Record<string, PermissionStatus>;
  error?: string;
  canRecordVideo: boolean;
  canAccessGallery: boolean;
  canSaveVideos: boolean;
}

const handleVideoPermissions = async (
  type: AndroidPermissionType = 'all',
  autoRequest: boolean = true,
): Promise<AndroidPermissionResult> => {
  try {
    // Define Android permissions
    const getAndroidPermissions = (
      permissionType: AndroidPermissionType,
    ): Permission[] => {
      switch (permissionType) {
        case 'camera':
          return [PERMISSIONS.ANDROID.CAMERA];
        case 'microphone':
          return [PERMISSIONS.ANDROID.RECORD_AUDIO];
        case 'storage':
          return [
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          ];
        case 'all':
        default:
          return [
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.RECORD_AUDIO,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          ];
      }
    };

    const requiredPermissions = getAndroidPermissions(type);

    // Check current permission status
    const currentStatus: Record<string, PermissionStatus> = {};
    for (const permission of requiredPermissions) {
      currentStatus[permission] = await check(permission);
    }

    // Calculate capabilities
    const cameraGranted =
      currentStatus[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED;
    const microphoneGranted =
      currentStatus[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.GRANTED;
    const readStorageGranted =
      currentStatus[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] ===
      RESULTS.GRANTED;
    const writeStorageGranted =
      currentStatus[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
      RESULTS.GRANTED;

    const capabilities = {
      canRecordVideo: cameraGranted && microphoneGranted,
      canAccessGallery: readStorageGranted,
      canSaveVideos: writeStorageGranted,
    };

    // If not auto-requesting, return current status
    if (!autoRequest) {
      const allGranted = Object.values(currentStatus).every(
        result => result === RESULTS.GRANTED,
      );

      return {
        granted: allGranted,
        results: currentStatus,
        error: undefined,
        ...capabilities,
      };
    }

    // Filter permissions that need to be requested
    const permissionsToRequest = requiredPermissions.filter(
      permission => currentStatus[permission] !== RESULTS.GRANTED,
    );

    // If all permissions are already granted
    if (permissionsToRequest.length === 0) {
      return {
        granted: true,
        results: currentStatus,
        error: undefined,
        ...capabilities,
      };
    }

    // Request missing permissions
    const requestResults = await requestMultiple(permissionsToRequest);

    // Merge current status with request results
    const finalResults = { ...currentStatus, ...requestResults };

    // Recalculate capabilities after request
    const finalCameraGranted =
      finalResults[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED;
    const finalMicrophoneGranted =
      finalResults[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.GRANTED;
    const finalReadStorageGranted =
      finalResults[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] ===
      RESULTS.GRANTED;
    const finalWriteStorageGranted =
      finalResults[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
      RESULTS.GRANTED;

    const finalCapabilities = {
      canRecordVideo: finalCameraGranted && finalMicrophoneGranted,
      canAccessGallery: finalReadStorageGranted,
      canSaveVideos: finalWriteStorageGranted,
    };

    // Check if all requested permissions are granted
    const allGranted = Object.values(finalResults).every(
      result => result === RESULTS.GRANTED,
    );

    return {
      granted: allGranted,
      results: finalResults,
      error: undefined,
      ...finalCapabilities,
    };
  } catch (error) {
    console.error('Android video permissions error:', error);
    return {
      granted: false,
      results: {},
      error:
        error instanceof Error ? error.message : 'Unknown permission error',
      canRecordVideo: false,
      canAccessGallery: false,
      canSaveVideos: false,
    };
  }
};

export {
  height,
  width,
  getAllUsers,
  checkUserExistsByEmail,
  updateUserInFirestore,
  languages,
  handleVideoPermissions,
};

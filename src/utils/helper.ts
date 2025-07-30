import { Dimensions, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  Permission,
  PermissionStatus,
  checkMultiple,
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

export type AndroidPermissionType = 'all' | 'camera' | 'storage' | 'microphone';

export interface AndroidPermissionResult {
  granted: boolean;
  results: Record<string, PermissionStatus>;
  error?: string;
  canRecordVideo: boolean;
  canAccessGallery: boolean;
  canSaveVideos: boolean;
}

const getAndroidPermissions = (
  permissionType: AndroidPermissionType,
): Permission[] => {
  const isApiLevel33OrHigher = Platform.Version >= 33;

  const cameraPermissions = [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
  ];
  const storagePermissions = isApiLevel33OrHigher
    ? [PERMISSIONS.ANDROID.READ_MEDIA_VIDEO]
    : [
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ];

  switch (permissionType) {
    case 'camera':
      return [PERMISSIONS.ANDROID.CAMERA];
    case 'microphone':
      return [PERMISSIONS.ANDROID.RECORD_AUDIO];
    case 'storage':
      return storagePermissions;
    case 'all':
    default:
      return [...cameraPermissions, ...storagePermissions];
  }
};

export const handleVideoPermissions = async (
  type: AndroidPermissionType = 'all',
  autoRequest: boolean = true,
): Promise<AndroidPermissionResult> => {
  if (Platform.OS !== 'android') {
    // For non-Android platforms, assume permissions are handled differently or granted.
    return {
      granted: true,
      results: {},
      canRecordVideo: true,
      canAccessGallery: true,
      canSaveVideos: true,
    };
  }

  try {
    const requiredPermissions = getAndroidPermissions(type);
    const statuses = await checkMultiple(requiredPermissions);

    const isApiLevel33OrHigher = Platform.Version >= 33;

    // Helper to check permission status
    const has = (permission: Permission) =>
      statuses[permission] === RESULTS.GRANTED;

    const calculateCapabilities = (
      currentStatuses: Record<string, PermissionStatus>,
    ) => ({
      canRecordVideo:
        has(PERMISSIONS.ANDROID.CAMERA) &&
        has(PERMISSIONS.ANDROID.RECORD_AUDIO),
      canAccessGallery: isApiLevel33OrHigher
        ? has(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO)
        : has(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
      canSaveVideos: isApiLevel33OrHigher
        ? true // WRITE_EXTERNAL_STORAGE is not needed to save to gallery on API 33+
        : has(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE),
    });

    let finalStatuses = statuses;
    const allCurrentlyGranted = Object.values(statuses).every(
      s => s === RESULTS.GRANTED,
    );

    if (!autoRequest || allCurrentlyGranted) {
      return {
        granted: allCurrentlyGranted,
        results: statuses,
        ...calculateCapabilities(statuses),
      };
    }

    const permissionsToRequest = requiredPermissions.filter(
      p => statuses[p] !== RESULTS.GRANTED,
    );

    if (permissionsToRequest.length > 0) {
      const requestResults = await requestMultiple(permissionsToRequest);
      finalStatuses = { ...statuses, ...requestResults };
    }

    const allFinallyGranted = Object.values(finalStatuses).every(
      result => result === RESULTS.GRANTED,
    );

    return {
      granted: allFinallyGranted,
      results: finalStatuses,
      ...calculateCapabilities(finalStatuses),
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
};

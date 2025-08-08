import { Dimensions, PermissionsAndroid, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  Permission,
  PermissionStatus,
  checkMultiple,
} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import { showError, showSuccess } from './toast';

type AndroidPermissionType = 'all' | 'camera' | 'storage' | 'microphone';

interface AndroidPermissionResult {
  granted: boolean;
  results: Record<string, PermissionStatus>;
  error?: string;
  canRecordVideo: boolean;
  canAccessGallery: boolean;
  canSaveVideos: boolean;
}

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const FONTS: Record<string, string> = {
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

const getAllUsers = async (
  currentUserEmail: string,
): Promise<FirestoreUser[]> => {
  try {
    const snapshot = await firestore().collection('users').get();

    const users: FirestoreUser[] = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(user => user.email !== currentUserEmail);

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

const getAndroidPermissions = (
  permissionType: AndroidPermissionType,
): Permission[] => {
  const isApiLevel33OrHigher = Platform.Version >= '33';

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

const handlePermissions = async (
  type: AndroidPermissionType = 'all',
  autoRequest: boolean = true,
): Promise<AndroidPermissionResult> => {
  if (Platform.OS !== 'android') {
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
        ? true
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

const checkIfMPINExists = async (email: string): Promise<boolean> => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const snapshot = await firestore()
      .collection('users')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();

      if (data?.mpinSet && data?.mpin) {
        return true;
      }
    } else {
      console.error('Error', 'User not found in Firestore');
      return false;
    }
  } catch (error: any) {
    showError('Failed to check MPIN');
    return false;
  }
};

const handleMediaDownload = async (
  mediaUri: string,
  mediaType: 'photo' | 'video',
  albumName = 'Allio Media',
) => {
  try {
    if (Platform.OS === 'android') {
      const hasPermission = await handlePermissions();
      if (!hasPermission) {
        showError('Storage permission is required');
        return;
      }
    }

    const extension = mediaType === 'photo' ? 'jpg' : 'mp4';
    const fileName = `MEDIA_${Date.now()}.${extension}`;
    const downloadDest = `${RNFS.CachesDirectoryPath}/${fileName}`;

    const downloadResult = await RNFS.downloadFile({
      fromUrl: mediaUri,
      toFile: downloadDest,
    }).promise;

    if (downloadResult.statusCode === 200) {
      await CameraRoll.saveAsset(downloadDest, {
        type: mediaType,
        album: albumName,
      });
      showSuccess(
        `${mediaType === 'photo' ? 'Image' : 'Video'} saved to gallery!`,
      );
    } else {
      showError(`Could not save ${mediaType}.`);
    }
  } catch (error) {
    console.error('Download error:', error);
    showError('Something went wrong while downloading.');
  }
};

const handleMediaShare = async (
  mediaUri: string,
  mediaType: 'photo' | 'video',
) => {
  try {
    const extension = mediaType === 'photo' ? 'jpg' : 'mp4';
    const fileName = `MEDIA_${Date.now()}.${extension}`;
    const tempPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

    const downloadResult = await RNFS.downloadFile({
      fromUrl: mediaUri,
      toFile: tempPath,
    }).promise;

    if (downloadResult.statusCode === 200) {
      const shareOptions = {
        title: `Share ${mediaType}`,
        url: `file://${tempPath}`,
        type: mediaType === 'photo' ? 'image/jpeg' : 'video/mp4',
        failOnCancel: false,
      };

      await Share.open(shareOptions);
    } else {
      showError(`Could not download ${mediaType} for sharing.`);
    }
  } catch (error: any) {
    console.error('Share error:', error);
    showError(`Something went wrong while sharing the ${mediaType}.`);
  }
};

const getCurrentTimestamp = () => {
  const now = new Date();
  return now.toISOString(); // or customize as needed
};

export {
  height,
  width,
  getAllUsers,
  checkUserExistsByEmail,
  requestUserPermission,
  updateUserInFirestore,
  handlePermissions,
  languages,
  FONTS,
  checkIfMPINExists,
  handleMediaDownload,
  handleMediaShare,
  getCurrentTimestamp,
};

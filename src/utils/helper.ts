import {
  AppState,
  AppStateStatus,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  Permission,
  PermissionStatus,
  checkMultiple,
} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import NetInfo from '@react-native-community/netinfo';
import Share from 'react-native-share';
import moment from 'moment';
import { showError, showSuccess } from './toast';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
} from '@notifee/react-native';
import { store } from '@redux/store';

type AndroidPermissionType = 'all' | 'camera' | 'storage' | 'microphone';

interface AndroidPermissionResult {
  granted: boolean;
  results: Record<string, PermissionStatus>;
  error?: string;
  canRecordVideo: boolean;
  canAccessGallery: boolean;
  canSaveVideos: boolean;
}

interface UserProfileData {
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  mobileNo: string;
}

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

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

    const calculateCapabilities = () => ({
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
        ...calculateCapabilities(),
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
      ...calculateCapabilities(),
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

const checkIfMPINExists = async (email: string) => {
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
  userEmail?: string, // name from props (optional)
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
        message:
          mediaType === 'photo' && userEmail
            ? `QR code for friend request: ${userEmail}`
            : undefined,
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

const getUserData = async (email: string): Promise<UserProfileData | null> => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const querySnapshot = await firestore()
      .collection('users')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      const userProfile: UserProfileData = {
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        profileImage: userData.profileImage,
        mobileNo: userData.mobileNo || '',
      };
      return userProfile;
    }

    return null;
  } catch (error) {
    console.error('[Firestore] Error fetching user data:', error);
    return null;
  }
};
const capitalizeFirst = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
const getCurrentTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

const saveFCMTokenToFirestore = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .set({ fcmToken }, { merge: true });
      }
    }
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

const removeFCMTokenFromFirestore = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await firestore().collection('users').doc(user.uid).update({
        fcmToken: firestore.FieldValue.delete(),
      });
    }
  } catch (error) {
    console.error('Error removing FCM token:', error);
  }
};

const uploadToCloudinary = async (file: {
  uri: any;
  type: any;
  fileName: any;
}) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.fileName || 'upload.jpg',
  });
  formData.append('upload_preset', 'chat_app_upload');

  try {
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/dmoajpxcj/image/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    return res.data.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

const formatTime = (timestamp: any) => {
  if (!timestamp) {
    return '';
  }
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return moment(date).format('h:mm A');
};

const formatDateLabel = (timestamp: any) => {
  if (!timestamp) {
    return '';
  }
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  if (moment(date).isSame(moment(), 'day')) {
    return 'Today';
  }
  if (moment(date).isSame(moment().subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  }
  return moment(date).format('DD MMM YYYY');
};

const monitorOnlineStatus = (email?: string) => {
  if (!email) {
    return;
  }

  const updateStatus = async (isOnline: boolean) => {
    try {
      // Update the user doc directly by email
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await userDoc.ref.set(
          {
            online: isOnline,
            lastSeen: new Date().toISOString(),
          },
          { merge: true },
        );
      }
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };

  updateStatus(true);

  const listener = (nextState: AppStateStatus) => {
    if (nextState === 'active') {
      updateStatus(true);
    } else {
      updateStatus(false);
    }
  };

  AppState.addEventListener('change', listener);

  const cleanup = () => {
    updateStatus(false);
  };

  return cleanup;
};

const formatLastSeen = (timestamp: string | number | Date) => {
  if (!timestamp) {
    return '';
  }
  const date = new Date(timestamp);
  const now = new Date();

  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Today
  if (diffDays === 0) {
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  }

  // Yesterday
  if (diffDays === 1) {
    return 'Yesterday';
  }

  // Everything else → formatted date (e.g. "21 May 2025")
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const checkSystemNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().hasPermission();
      const firebaseEnabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      const notifeeSettings = await notifee.getNotificationSettings();
      const notifeeEnabled =
        notifeeSettings.authorizationStatus === AuthorizationStatus.AUTHORIZED;

      return firebaseEnabled && notifeeEnabled;
    } else if (Platform.OS === 'android') {
      const authStatus = await messaging().hasPermission();
      const firebaseEnabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED;

      const notifeeSettings = await notifee.getNotificationSettings();
      const notifeeEnabled =
        notifeeSettings.authorizationStatus === AuthorizationStatus.AUTHORIZED;

      // For Android 13+
      if (Platform.Version >= 33) {
        const postNotificationPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return firebaseEnabled && notifeeEnabled && postNotificationPermission;
      }

      return firebaseEnabled && notifeeEnabled;
    }
    return false;
  } catch (error) {
    console.error('Error checking system notification permission:', error);
    return false;
  }
};

// NEW: Request system permission only (no token saving)
const requestSystemNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: true,
        provisional: false,
        sound: true,
      });

      const firebaseEnabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      const notifeePermission = await notifee.requestPermission();
      const notifeeEnabled =
        notifeePermission.authorizationStatus ===
        AuthorizationStatus.AUTHORIZED;

      return firebaseEnabled && notifeeEnabled;
    } else if (Platform.OS === 'android') {
      const authStatus = await messaging().requestPermission();
      const firebaseEnabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED;

      const notifeePermission = await notifee.requestPermission();
      const notifeeEnabled =
        notifeePermission.authorizationStatus ===
        AuthorizationStatus.AUTHORIZED;

      // For Android 13+
      if (Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        const postNotificationGranted =
          result === PermissionsAndroid.RESULTS.GRANTED;
        return firebaseEnabled && notifeeEnabled && postNotificationGranted;
      }

      return firebaseEnabled && notifeeEnabled;
    }
    return false;
  } catch (error) {
    console.error('Error requesting system notification permission:', error);
    return false;
  }
};

// NEW: Apply user's notification settings (check both system + user preference)
const applyNotificationSettings = async (): Promise<void> => {
  try {
    // Get user's notification preference from Redux
    const state = store.getState();
    const userWantsNotifications = state.auth.notificationsEnabled;

    if (userWantsNotifications) {
      const hasSystemPermission = await checkSystemNotificationPermission();

      if (hasSystemPermission) {
        await saveFCMTokenToFirestore();
      }
    } else {
      await removeFCMTokenFromFirestore();
    }
  } catch (error) {
    console.error('Error applying notification settings:', error);
  }
};

// NEW: Request permission and apply settings (for use in Settings toggle)
const requestAndApplyNotificationSettings = async (): Promise<boolean> => {
  try {
    const permissionGranted = await requestSystemNotificationPermission();

    if (permissionGranted) {
      await saveFCMTokenToFirestore();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      'Error requesting and applying notification settings:',
      error,
    );
    return false;
  }
};

const onDisplayNotification = async (data: { title?: any; body?: any }) => {
  try {
    await notifee.requestPermission();

    const channelId = 'chat_messages';

    // Ensure channel exists even if initNotifications not yet run (headless case)
    const channels = await notifee.getChannels();
    if (!channels.find(c => c.id === channelId)) {
      await notifee.createChannel({
        id: channelId,
        name: 'Chat Messages',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        sound: 'default',
      });
    }

    const notificationConfig = {
      title: data.title || 'New Message',
      body: data.body || 'You have a new message',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        smallIcon: 'ic_launcher',
        sound: 'default',
        vibrationPattern: [300, 500],
        showWhen: true,
        when: Date.now(),
      },
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    };
    await notifee.displayNotification(notificationConfig);
  } catch (error) {
    console.error('Display notification error:', error);
  }
};

const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable !== false;
};

const formatLastUpdated = (timeStamp: string | Date): string => {
  const now = moment();
  const updated = moment(timeStamp);

  const diffInSeconds = now.diff(updated, 'seconds');
  const diffInMinutes = now.diff(updated, 'minutes');
  const diffInHours = now.diff(updated, 'hours');
  const diffInDays = now.diff(updated, 'days');

  if (diffInSeconds < 60) {
    return 'Last updated a few seconds ago';
  }

  if (diffInMinutes < 5) {
    return `Last updated ${diffInMinutes} minute${
      diffInMinutes > 1 ? 's' : ''
    } ago`;
  }

  if (diffInMinutes < 60) {
    return 'Last updated 5 minutes ago';
  }

  if (diffInHours < 24) {
    if (diffInHours === 1) return 'Last updated 1 hour ago';
    return `Last updated ${diffInHours} hours ago`;
  }

  if (diffInDays === 1) {
    return 'Last updated yesterday';
  }

  // Fallback → formatted date
  return `Last updated ${updated.format('DD MMM, YYYY')}`;
};

export {
  height,
  width,
  getAllUsers,
  checkUserExistsByEmail,
  updateUserInFirestore,
  handlePermissions,
  languages,
  checkIfMPINExists,
  handleMediaDownload,
  handleMediaShare,
  getUserData,
  getCurrentTimestamp,
  capitalizeFirst,
  checkSystemNotificationPermission,
  requestSystemNotificationPermission,
  applyNotificationSettings,
  requestAndApplyNotificationSettings,
  uploadToCloudinary,
  formatDateLabel,
  formatTime,
  monitorOnlineStatus,
  onDisplayNotification,
  formatLastSeen,
  saveFCMTokenToFirestore,
  removeFCMTokenFromFirestore,
  isOnline,
  formatLastUpdated,
};

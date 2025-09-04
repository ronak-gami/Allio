import { Alert, Linking, Platform } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';
import { isVersionLower } from '@utils/helper';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.bbqbattleindc'; // Replace with your Play Store package name

export const checkAppVersion = async () => {
  try {
    // Set a minimum fetch interval to avoid excessive calls in production
    // Use 0 for development to fetch every time.
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: __DEV__ ? 0 : 3600000, // 1 hour in production
    });

    // Fetch and activate the configuration
    const fetchedRemotely = await remoteConfig().fetchAndActivate();

    if (fetchedRemotely) {
      console.log('Configs were fetched from the backend and activated.');
    } else {
      console.log(
        'No new configs were fetched from the backend, using cached values.',
      );
    }

    const minVersionKey =
      Platform.OS === 'ios' ? 'ios_minimum_version' : 'android_minimum_version';
    const latestVersionKey =
      Platform.OS === 'ios' ? 'ios_latest_version' : 'android_latest_version';

    // Get the values from Remote Config
    const minimumRequiredVersion = remoteConfig()
      .getValue(minVersionKey)
      .asString();
    const latestAvailableVersion = remoteConfig()
      .getValue(latestVersionKey)
      .asString();

    // Get the app's current version
    const currentVersion = DeviceInfo.getVersion();

    // --- Force Update Check ---
    if (isVersionLower(currentVersion, minimumRequiredVersion)) {
      Alert.alert(
        'Update Required',
        'To continue using the app, please update to the latest version.',
        [
          {
            text: 'Update Now',
            onPress: () => Linking.openURL(PLAY_STORE_URL),
          },
        ],
        { cancelable: false }, // User cannot dismiss this alert
      );
      return; // Stop further checks
    }

    // --- Suggested Update Check ---
    if (isVersionLower(currentVersion, latestAvailableVersion)) {
      Alert.alert(
        'Update Available',
        'A new version of the app is available with new features and improvements.',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Update Now',
            onPress: () => Linking.openURL(PLAY_STORE_URL),
          },
        ],
      );
    }
  } catch (error) {
    console.error('Error fetching remote config: ', error);
    // Don't block the user if the check fails
  }
};

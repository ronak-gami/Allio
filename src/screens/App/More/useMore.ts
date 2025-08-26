import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { logout } from '@redux/slices/AuthSlice';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { HOME } from '@utils/constant';
import { TabParamList } from '@types/navigations';
import { resetMedia } from '@redux/slices/MediaSlice';
import { capitalizeFirst } from '@utils/helper';
import { t } from 'i18next';
import { useBottomSheet } from '../../../context/BottomSheetContext';

type Navigation = BottomTabNavigationProp<TabParamList, 'More'>;

interface BottomSheetConfig {
  title: string;
  content: React.ReactNode;
  snapPoints: string[];
  showCloseButton: boolean;
  buttons?: Array<{
    title: string;
    onPress: () => void;
    variant: string;
  }>;
}

export const useMore = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<Navigation>();
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const handleLogout = useCallback(async () => {
    try {
      const authInstance = getAuth();
      const currentUser = authInstance.currentUser;
      if (currentUser) {
        await firestore().collection('users').doc(currentUser.uid).update({
          fcmToken: firestore.FieldValue.delete(),
          fcmUpdatedAt: firestore.FieldValue.delete(),
        });
        await authInstance.signOut();
        dispatch(resetMedia());
        dispatch(logout());
        closeBottomSheet();
      }
    } catch (error) {
      console.error('Logout Error:', error);
      crashlytics().recordError(error as Error);
    }
  }, [dispatch, closeBottomSheet]);

  const handleDeleteProfile = useCallback(async () => {
    try {
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      if (user) {
        await firestore().collection('users').doc(user.uid).delete();
        await user.delete();
        dispatch(logout());
        closeBottomSheet();
      }
    } catch (error) {
      console.error('Delete account error:', error);
      crashlytics().recordError(error as Error);
    }
  }, [dispatch, closeBottomSheet]);

  const settingsConfig = useMemo(
    () => [
      {
        title: 'settings.profile',
        type: 'navigation',
        screenName: HOME.Profile,
      },
      {
        key: 'friends',
        title: 'settings.My Friends',
        type: 'navigation',
        screenName: HOME.MyFriends,
      },
      {
        key: 'AI Assistant',
        title: 'AI Assistant',
        type: 'navigation',
        screenName: HOME.AiAssistant,
      },
      {
        key: 'theme',
        title: 'settings.Theme',
        type: 'bottomSheet',
      },
      {
        key: 'language',
        title: 'settings.Language',
        type: 'bottomSheet',
      },
      {
        key: 'delete',
        title: 'settings.Delete Account',
        type: 'bottomSheet',
      },
      {
        key: 'logout',
        title: 'settings.Logout',
        type: 'bottomSheet',
      },
    ],
    [],
  );

  const openBottomSheetWithConfig = useCallback(
    (config: BottomSheetConfig) => {
      openBottomSheet(config);
    },
    [openBottomSheet],
  );

  const handleNavigation = useCallback(
    (screenName: keyof TabParamList) => {
      navigation.navigate(screenName);
    },
    [navigation],
  );

  const handleItemPress = useCallback(
    (key: string, bottomSheetConfigs: Record<string, BottomSheetConfig>) => {
      const config = settingsConfig.find(item => item.key === key);

      if (!config) {
        console.warn(`Configuration not found for key: ${key}`);
        return;
      }

      if (config.type === 'navigation') {
        handleNavigation(config.screenName as keyof TabParamList);
      } else if (config.type === 'bottomSheet') {
        const bottomSheetConfig = bottomSheetConfigs[key];
        if (bottomSheetConfig) {
          openBottomSheetWithConfig(bottomSheetConfig);
        } else {
          openBottomSheetWithConfig({
            title: 'Coming Soon',
            content: null,
            showCloseButton: true,
            snapPoints: ['40%'],
          });
        }
      }
    },
    [settingsConfig, handleNavigation, openBottomSheetWithConfig],
  );

  return {
    settingsConfig,
    handleItemPress,
    handleLogout,
    handleDeleteProfile,
    getTranslation: (key: string) => capitalizeFirst(t(key)),
  };
};

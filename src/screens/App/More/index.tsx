import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CustomFlatList,
  LanguageOrganism,
  Text,
  ThemeOrganism,
  DeleteProfileOrganism,
  LogoutOrganism,
  Container,
} from '@components/index';

import { logout } from '@redux/slices/AuthSlice';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { TabParamList } from '@types/navigations';
import { HOME } from '@utils/constant';

import { useBottomSheet } from '../../../context/BottomSheetContext';
import useStyle from './style';

import { capitalizeFirst } from '@utils/helper';

type Props = BottomTabScreenProps<TabParamList, 'More'>;

const More: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

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

  const settingsConfig = [
    {
      title: 'settings.profile',
      type: 'navigation' as const,
      screenName: HOME.Profile,
    },
    {
      key: 'friends',
      title: 'settings.My Friends',
      type: 'navigation' as const,
      screenName: HOME.MyFriends,
    },
    {
      key: 'theme',
      title: 'settings.Theme',
      type: 'bottomSheet' as const,
    },
    {
      key: 'language',
      title: 'settings.Language',
      type: 'bottomSheet' as const,
    },
    {
      key: 'delete',
      title: 'settings.Delete Account',
      type: 'bottomSheet' as const,
    },
    {
      key: 'logout',
      title: 'settings.Logout',
      type: 'bottomSheet' as const,
    },
  ];

  // Single handler for all items
  const handleItemPress = useCallback(
    (key: string) => {
      const config = settingsConfig.find(item => item.key === key);

      if (!config) {
        console.warn(`Configuration not found for key: ${key}`);
        return;
      }

      if (config.type === 'navigation') {
        navigation.navigate(config.screenName as keyof TabParamList);
      } else if (config.type === 'bottomSheet') {
        // Handle different bottom sheet content based on key
        switch (key) {
          case 'theme':
            openBottomSheet({
              title: capitalizeFirst(t('bottomSheet.selectTheme')),
              content: <ThemeOrganism />,
              snapPoints: ['40%'],
              showCloseButton: true,
            });
            break;

          case 'language':
            openBottomSheet({
              title: capitalizeFirst(t('bottomSheet.selectTheme')),
              snapPoints: ['50%'],
              content: <LanguageOrganism />,
              showCloseButton: true,
            });
            break;

          case 'delete':
            openBottomSheet({
              title: capitalizeFirst(t('bottomSheet.deleteAccount')),
              content: (
                <DeleteProfileOrganism onConfirm={handleDeleteProfile} />
              ),

              showCloseButton: true,
              snapPoints: ['50%'],
              buttons: [
                {
                  title: capitalizeFirst(t('bottomSheet.deleteAccount')),
                  onPress: handleDeleteProfile,
                  variant: 'primary',
                },
              ],
            });
            break;

          case 'logout':
            openBottomSheet({
              title: capitalizeFirst(t('bottomSheet.confirmLogout')),
              content: <LogoutOrganism onConfirm={handleLogout} />,
              showCloseButton: true,
              snapPoints: ['40%'],
              buttons: [
                {
                  title: capitalizeFirst(t('bottomSheet.confirmLogout')),
                  onPress: handleLogout,
                  variant: 'primary',
                },
              ],
            });
            break;

          default:
            openBottomSheet({
              title: 'Coming Soon',
              content: <Text>This feature is coming soon!</Text>,

              showCloseButton: true,
            });
        }
      }
    },
    [
      settingsConfig,
      navigation,
      openBottomSheet,
      closeBottomSheet,
      handleLogout,
      handleDeleteProfile,
    ],
  );

  // const renderItem = ({ item }: { item: (typeof settingsConfig)[0] }) => (
  //   <TouchableOpacity
  //     style={styles.item}
  //     onPress={() => handleItemPress(item.key)}>
  //     <Text style={styles.itemText} type="semibold" >
  //      {t{item.title}}
  //     </Text>
  //   </TouchableOpacity>
  // );
  const renderItem = ({ item }: { item: (typeof settingsConfig)[0] }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item.key)}>
      <Text style={styles.itemText} type="semibold">
        {t(item.title)}
      </Text>
    </TouchableOpacity>
  );
  return (
    // <View style={styles.container}>
    <Container title="More.More">
      <View style={styles.container}>
        <CustomFlatList data={settingsConfig} renderItem={renderItem} />
      </View>
    </Container>
  );
};

export default More;

import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
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

import { useDispatch } from 'react-redux';
import { logout } from '@redux/slices/AuthSlice';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { TabParamList } from '@types/navigations';

import { useBottomSheet } from '../../../context/BottomSheetContext';
import useStyle from './style';
import { HOME, settingsData } from '@utils/constant';
import { resetMedia } from '@redux/slices/MediaSlice';

type Props = BottomTabScreenProps<TabParamList, 'More'>;

const More: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const dispatch = useDispatch();

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
        key: 'profile',
        title: 'Profile',
        type: 'navigation' as const,
        screenName: HOME.Profile,
      },
      {
        key: 'friends',
        title: 'My Friends',
        type: 'navigation' as const,
        screenName: HOME.MyFriends,
      },
      {
        key: 'theme',
        title: 'Theme',
        type: 'bottomSheet' as const,
      },
      {
        key: 'language',
        title: 'Language',
        type: 'bottomSheet' as const,
      },
      {
        key: 'delete',
        title: 'Delete Account',
        type: 'bottomSheet' as const,
      },
      {
        key: 'logout',
        title: 'Logout',
        type: 'bottomSheet' as const,
      },
    ],
    [],
  );

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
              title: 'Select Theme',
              content: <ThemeOrganism />,
              snapPoints: ['40%'],
              showCloseButton: true,
            });
            break;

          case 'language':
            openBottomSheet({
              title: 'Select Language',
              snapPoints: ['50%'],
              content: <LanguageOrganism />,
              showCloseButton: true,
            });
            break;

          case 'delete':
            openBottomSheet({
              title: 'Delete Account',
              content: (
                <DeleteProfileOrganism onConfirm={handleDeleteProfile} />
              ),

              showCloseButton: true,
              snapPoints: ['50%'],
              buttons: [
                {
                  title: 'Delete Account',
                  onPress: handleDeleteProfile,
                  variant: 'primary',
                },
              ],
            });
            break;

          case 'logout':
            openBottomSheet({
              title: 'Confirm Logout',
              content: <LogoutOrganism onConfirm={handleLogout} />,
              showCloseButton: true,
              snapPoints: ['40%'],
              buttons: [
                {
                  title: 'Logout',
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
      handleLogout,
      handleDeleteProfile,
    ],
  );

  const renderItem = ({ item }: { item: { key: string; title: string } }) => (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleItemPress(item.key)}>
        <Text style={styles.itemText} type="semibold">
          {item.title}
        </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </>
  );

  return (
    <Container showLoader={false} title="More.More">
      <View style={styles.container}>
        <CustomFlatList data={settingsData} renderItem={renderItem} />
      </View>
    </Container>
  );
};

export default More;

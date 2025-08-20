import React, { useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { getAuth } from '@react-native-firebase/auth';

import { Container, CustomFlatList, Text } from '@components/index';
import { TabParamList } from '@types/navigations';
import { logout } from '@redux/slices/AuthSlice';
import useStyle from './style';
import { HOME } from '@utils/constant';
import AppBottomSheet from '@components/atoms/appBottomSheet';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';

type Props = BottomTabScreenProps<TabParamList, 'More'>;

const More: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const dispatch = useDispatch();

  const handleLogout = async () => {
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
      }
    } catch (error) {
      console.error('Logout Error:', error);
      crashlytics().recordError(error as Error);
    }
  };

  const handleItemPress = (key: string) => {
    switch (key) {
      case 'profile':
        navigation.navigate(HOME.Profile);
        break;
      case 'friends':
        navigation.navigate(HOME.MyFriends);
        break;
      case 'theme':
        // navigation.navigate('Theme');
        break;
      case 'language':
        // navigation.navigate('Language');
        break;
      case 'delete':
        // navigation.navigate('DeleteAccount');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const settingsData = [
    { key: 'profile', title: 'Profile' },
    { key: 'friends', title: 'My Friends' },
    { key: 'theme', title: 'Theme' },
    { key: 'language', title: 'Language' },
    { key: 'delete', title: 'Delete Account' },
    { key: 'logout', title: 'Logout' },
  ];

  const renderItem = ({ item }: { item: { key: string; title: string } }) => (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          bottomSheetRef?.current?.present();
        }}>
        <Text style={styles.itemText} type="semibold">
          {item.title}
        </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </>
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <Container showLoader={false} title="Settings">
      <View style={styles.container}>
        <CustomFlatList data={settingsData} renderItem={renderItem} />
      </View>
      <AppBottomSheet ref={bottomSheetRef} height={['50%', '60%']}>
        <View style={styles.searchContainer}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Bottom Sheet Content
          </Text>
          <BottomSheetTextInput
            placeholder="Search..."
            style={{
              backgroundColor: '#f0f0f0',
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>
      </AppBottomSheet>
    </Container>
  );
};
export default More;

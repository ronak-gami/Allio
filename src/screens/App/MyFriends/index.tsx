import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import useStyle from './style';
import { CustomFlatList, CustomLoader, Text } from '@components/index';
import UserCard from '@components/cards/UserCard';
import CustomHeader from '@components/atoms/CustomHeader';
import { getAllUsers } from '@utils/helper';
import { RootState } from '@redux/store';
import { IMAGES } from '@assets/index';

const MyFriends = () => {
  const styles = useStyle();
  const navigation = useNavigation();
  const currentUserEmail = useSelector(
    (state: RootState) => state.auth.userData.email,
  );

  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'all'>(
    'friends',
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllUsersWithRelation();
  }, [activeTab]);

  const fetchAllUsersWithRelation = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers(currentUserEmail);
      const snapshot = await firestore().collection('relation').get();

      const relationMap = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        const from = data.from?.toLowerCase();
        const to = data.to?.toLowerCase();
        const isAccept = data.isAccept;

        const key = from < to ? `${from}_${to}` : `${to}_${from}`;
        relationMap[key] = { from, to, isAccept };
      });

      const email1 = currentUserEmail.toLowerCase();

      const filteredUsers = allUsers
        .map(user => {
          const email2 = user.email?.toLowerCase();
          const key =
            email1 < email2 ? `${email1}_${email2}` : `${email2}_${email1}`;
          const relation = relationMap[key];

          if (!relation) {
            return { ...user, relationStatus: 'none' };
          }

          if (relation.isAccept) {
            return { ...user, relationStatus: 'accepted' };
          }

          if (relation.from === email1) {
            return { ...user, relationStatus: 'sent' };
          }

          if (relation.to === email1) {
            return { ...user, relationStatus: 'received' };
          }

          return { ...user, relationStatus: 'pending' };
        })
        .filter(user => {
          if (activeTab === 'all') return true;
          if (activeTab === 'friends')
            return user.relationStatus === 'accepted';
          if (activeTab === 'pending') return user.relationStatus === 'sent';
        });

      setUsers(filteredUsers);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users with relation:', err);
      setLoading(false);
    }
  };

  const renderUser = ({ item, index }: { item: any; index: number }) => (
    <UserCard user={item} index={index} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={IMAGES.Nodata}
        style={styles.noGalleryIcon}
        resizeMode="contain"
      />
      <Text type="BOLD" style={styles.emptyStateTitle}>
        No Users Found
      </Text>
      <Text type="REGULAR" style={styles.emptyStateSubtitle}>
        Currently we don't have any users. Please share this app with your
        friends and family.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        title="My Friends"
        showBackArrow={true}
        onBackPress={navigation.goBack}
        showProfile={false}
      />

      <View style={styles.headerContainer}>
        {['friends', 'pending', 'all'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab as any)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && <View style={styles.bottomLine} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>
        {loading ? (
          <CustomLoader visible={loading} />
        ) : (
          <CustomFlatList
            data={users}
            renderItem={renderUser}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </View>
  );
};

export default MyFriends;

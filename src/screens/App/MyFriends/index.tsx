import React, { useMemo } from 'react';
import { View, Image } from 'react-native';
import {
  Container,
  CustomFlatList,
  Text,
  CustomSimpleTab,
} from '@components/index';
import UserCard from '@components/cards/UserCard';
import { IMAGES } from '@assets/index';
import { useMyFriends } from './useMyFriends';
import useStyle from './style';

const MyFriends = () => {
  const styles = useStyle();
  const { activeTab, setActiveTab, users, states, onRefresh } = useMyFriends();

  const tabs = [
    { id: 'friends', title: 'Friends' },
    { id: 'pending', title: 'Pending' },
    { id: 'all', title: 'All' },
  ];

  const sortedUsers = useMemo(() => {
    if (activeTab !== 'all') {
      return users;
    }

    return [...users].sort((a, b) => {
      const order = { accepted: 1, sent: 1 };
      const aOrder = order[a.relationStatus] || 0;
      const bOrder = order[b.relationStatus] || 0;
      return aOrder - bOrder;
    });
  }, [users, activeTab]);

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
    <Container title="My Friends" showLoader={states?.loading}>
      <View style={styles.container}>
        <CustomSimpleTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={tabId => setActiveTab(tabId)}
        />
        <CustomFlatList
          data={sortedUsers}
          renderItem={renderUser}
          ListEmptyComponent={renderEmptyState}
          refreshing={states?.refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </Container>
  );
};

export default MyFriends;

import React, { useMemo } from 'react';
import { View, Image, RefreshControl } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {
  Container,
  Text,
  CustomSimpleTab,
  CustomFlatList,
} from '@components/index';
import UserCard from '@components/cards/UserCard';
import { IMAGES } from '@assets/index';
import useStyle from './style';
import { useMyFriends } from './useMyFriends';

const MyFriends = () => {
  const styles = useStyle();
  const {
    activeTab,
    setActiveTab,
    users,
    pinnedUsers,
    states,
    onRefresh,
    handlePin,
    handleUnpin,
    handleDragEnd,
    selectedUser,
    setSelectedUser,
  } = useMyFriends();

  const tabs = [
    { id: 'friends', title: 'Friends' },
    { id: 'pending', title: 'Pending' },
    { id: 'all', title: 'All' },
  ];

  const pinnedUserObjects = useMemo(
    () => users.filter(u => pinnedUsers.includes(u.email)),
    [users, pinnedUsers],
  );

  const nonPinnedUsers = useMemo(
    () =>
      users
        .filter(u => !pinnedUsers.includes(u.email))
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)),
    [users, pinnedUsers],
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
          onTabChange={setActiveTab}
        />

        {activeTab === 'friends' ? (
          <View>
            {pinnedUserObjects.map(user => (
              <UserCard
                key={user.id}
                user={user}
                isFriendTab={true}
                pinnedUsers={pinnedUsers}
                onPin={handlePin}
                onUnpin={handleUnpin}
                selectedUser={selectedUser}
              />
            ))}

            <DraggableFlatList
              data={nonPinnedUsers}
              keyExtractor={item => item.id}
              renderItem={({ item, drag, isActive }) => (
                <UserCard
                  user={item}
                  drag={drag}
                  isActive={isActive}
                  isFriendTab
                  pinnedUsers={pinnedUsers}
                  onPin={handlePin}
                  onUnpin={handleUnpin}
                  onLongPressUser={setSelectedUser}
                  selectedUser={selectedUser}
                />
              )}
              onDragBegin={index => {
                nonPinnedUsers[index];
              }}
              onDragEnd={({ data, from, to }) => {
                if (from !== to) {
                  handleDragEnd({ data, from, to });
                }
              }}
              activationDistance={50}
              ListEmptyComponent={renderEmptyState}
              refreshControl={
                <RefreshControl
                  refreshing={states.refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          </View>
        ) : (
          <CustomFlatList
            data={[...pinnedUserObjects, ...nonPinnedUsers]}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <UserCard
                user={item}
                pinnedUsers={pinnedUsers}
                isFriendTab={false}
                onLongPressUser={setSelectedUser}
                selectedUser={selectedUser}
              />
            )}
            ListEmptyComponent={renderEmptyState}
            refreshing={states?.refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </Container>
  );
};

export default MyFriends;

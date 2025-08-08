import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CustomFlatList, CustomLoader, Text } from '@components/index';
import UserCard from '@components/cards/UserCard';
import CustomHeader from '@components/atoms/CustomHeader';
import { IMAGES } from '@assets/index';

import { useMyFriends } from './useMyFriends';
import useStyle from './style';

const MyFriends = () => {
  const styles = useStyle();
  const navigation = useNavigation();
  const { activeTab, setActiveTab, users, loading } = useMyFriends();

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
        showBackArrow
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

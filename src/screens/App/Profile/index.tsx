import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import {
  Text,
  VideoCard,
  CustomFlatList,
  Button,
  Container,
} from '@components/index';
import useStyle from './style';
import { IMAGES, ICONS } from '@assets/index';
import useProfile from './useProfile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@types/navigations';

type ProfileProps = NativeStackScreenProps<HomeStackParamList, 'Profile'>;

const ProfileHeader: React.FC<{
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  mobileNo?: string;
  images: any[];
  videos: any[];
  styles: ReturnType<typeof useStyle>;
  isExternalProfile: boolean;
  navigateToMyFriends: () => void;
  isFriend: boolean;
}> = ({
  email,
  firstName,
  lastName,
  profileImage,
  mobileNo,
  images,
  videos,
  styles,
  isExternalProfile,
  navigateToMyFriends,
  isFriend,
}) => {
  const displayName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || lastName || '';

  const imageSource = profileImage
    ? { uri: profileImage }
    : IMAGES.Dummy_Profile;

  return (
    <View style={styles.profileHeaderContainer}>
      <View style={styles.topSectionContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={imageSource}
            style={styles.profileImage}
            defaultSource={IMAGES.Dummy_Profile}
          />
          <View style={styles.onlineIndicator} />
        </View>

        <View style={styles.nameAndStatsContainer}>
          {displayName && (
            <Text type="BOLD" style={styles.displayName}>
              {displayName}
            </Text>
          )}
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text type="BOLD" style={styles.statNumber}>
                {images?.length || 0}
              </Text>
              <Text type="SEMIBOLD" style={styles.statLabel}>
                Images
              </Text>
            </View>

            <View style={styles.statSeparator} />

            <View style={styles.statItem}>
              <Text type="BOLD" style={styles.statNumber}>
                {videos?.length || 0}
              </Text>
              <Text type="SEMIBOLD" style={styles.statLabel}>
                Videos
              </Text>
            </View>

            <View style={styles.statSeparator} />

            <View style={styles.statItem}>
              <Text type="BOLD" style={styles.statNumber}>
                0
              </Text>
              <Text type="SEMIBOLD" style={styles.statLabel}>
                Reels
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.profileInfoContainer}>
        <Text type="SEMIBOLD" style={styles.email}>
          {email}
        </Text>
        {mobileNo && (
          <Text type="REGULAR" style={styles.mobileNo}>
            {mobileNo}
          </Text>
        )}
      </View>
      {isExternalProfile ? (
        isFriend ? null : (
          <Button title="Friend Request" onPress={navigateToMyFriends} />
        )
      ) : null}
    </View>
  );
};

const TabBar: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  styles: ReturnType<typeof useStyle>;
}> = ({ activeTab, onTabChange, styles }) => (
  <View style={styles.contentHeader}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'images' && styles.activeTab]}
      onPress={() => onTabChange('images')}>
      <Text
        style={[
          styles.tabText,
          activeTab === 'images' && styles.activeTabText,
        ]}>
        Images
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
      onPress={() => onTabChange('videos')}>
      <Text
        style={[
          styles.tabText,
          activeTab === 'videos' && styles.activeTabText,
        ]}>
        Videos
      </Text>
    </TouchableOpacity>
  </View>
);

const MediaContent: React.FC<{
  activeTab: string;
  images: any[];
  videos: any[];
  styles: ReturnType<typeof useStyle>;
}> = ({ activeTab, images, videos, styles }) => {
  const renderEmptyVideoState = () => (
    <View style={styles.emptyGridContainer}>
      <Image
        source={ICONS.NoVideo}
        style={styles.emptyGridIcon}
        resizeMode="contain"
      />
      <Text type="BOLD" style={styles.emptyGridTitle}>
        No Videos Yet
      </Text>
    </View>
  );

  const renderEmptyImageState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={ICONS.gallery}
        style={styles.noGalleryIcon}
        resizeMode="contain"
      />
      <Text type="BOLD" style={styles.emptyStateTitle}>
        No Images Yet
      </Text>
    </View>
  );

  if (activeTab === 'videos') {
    return (
      <CustomFlatList
        key="videos"
        data={videos || []}
        renderItem={({ item }) => <VideoCard item={item} />}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        ListEmptyComponent={renderEmptyVideoState()}
      />
    );
  }

  return (
    <CustomFlatList
      key="images"
      data={images || []}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          style={styles.mediaItem}
          resizeMode="cover"
        />
      )}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.gridContent}
      ListEmptyComponent={renderEmptyImageState()}
    />
  );
};

const Profile: React.FC<ProfileProps> = ({ route }) => {
  const styles = useStyle();
  const { states, data, isExternalProfile, navigateToMyFriends } = useProfile({
    userEmail: route.params?.email,
  });

  return (
    <Container showLoader={false} showBackArrow title="Profile">
      <View style={styles.container}>
        <ProfileHeader
          email={data.email}
          firstName={data.firstName}
          lastName={data.lastName}
          profileImage={data.profileImage}
          mobileNo={data.mobileNo}
          images={data.allImages}
          videos={data.allVideos}
          styles={styles}
          isExternalProfile={isExternalProfile}
          navigateToMyFriends={navigateToMyFriends}
          isFriend={states?.isFriend}
        />
        <TabBar
          activeTab={states.activeTab}
          onTabChange={states.setActiveTab}
          styles={styles}
        />
        <View style={styles.contentContainer}>
          <MediaContent
            activeTab={states.activeTab}
            images={data.images}
            videos={data.videos}
            styles={styles}
          />
        </View>
      </View>
    </Container>
  );
};

export default Profile;

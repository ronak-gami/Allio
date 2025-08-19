import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import {
  Text,
  VideoCard,
  CustomFlatList,
  Button,
  Container,
} from '@components/index';
import { useTranslation } from 'react-i18next';

import useStyle from './style';
import { IMAGES, ICONS } from '@assets/index';
import useProfile from './useProfile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@types/navigations';
import { useTheme } from '@react-navigation/native';

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
  relationStatus: 'accepted' | 'sent' | 'pending' | 'received' | 'notsent';
  handleSend?: () => void;
  handleAccept?: () => void;
  handleReject?: () => void;
  states: object;
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
  handleSend,
  handleAccept,
  handleReject,
  states,
}) => {
  const displayName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || lastName || '';

  const imageSource = profileImage
    ? { uri: profileImage }
    : IMAGES.Dummy_Profile;

  const { colors } = useTheme();
  const { t } = useTranslation();
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

      {isExternalProfile && !states?.isFriend && (
        <>
          {states?.relationStatus === 'notsent' && (
            <Button title="Send" onPress={handleSend} />
          )}
          {states?.relationStatus === 'sent' && (
            <Button title="Pending" disabled />
          )}
          {states?.relationStatus === 'received' && (
            <View style={styles.buttonRow}>
              <Button
                title="Accept"
                onPress={handleAccept}
                style={styles.button}
                outlineColor={colors.primary}
              />
              <Button
                title="Reject"
                onPress={handleReject}
                style={styles.button}
                outlineColor={colors.error}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const TabBar: React.FC<{
  onTabChange: (tab: string) => void;
  states: object;
  styles: ReturnType<typeof useStyle>;
}> = ({ onTabChange, styles, states }) => (
  <View style={styles.contentHeader}>
    <TouchableOpacity
      style={[styles.tab, states?.activeTab === 'images' && styles.activeTab]}
      onPress={() => onTabChange('images')}>
      <Text
        style={[
          styles.tabText,
          states?.activeTab === 'images' && styles.activeTabText,
        ]}>
        Images
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, states?.activeTab === 'videos' && styles.activeTab]}
      onPress={() => onTabChange('videos')}>
      <Text
        style={[
          styles.tabText,
          states?.activeTab === 'videos' && styles.activeTabText,
        ]}>
        Videos
      </Text>
    </TouchableOpacity>
  </View>
);

const MediaContent: React.FC<{
  images: any[];
  videos: any[];
  onRefresh: () => void;
  states: object;
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
  const {
    states,
    data,
    isExternalProfile,
    navigateToMyFriends,
    handleSend,
    handleAccept,
    handleReject,
    onRefresh,
  } = useProfile({
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
          isFriend={states.isFriend}
          relationStatus={states.relationStatus}
          handleSend={handleSend}
          handleAccept={handleAccept}
          handleReject={handleReject}
          states={states}
        />
        <TabBar
          activeTab={states.activeTab}
          onTabChange={states.setActiveTab}
          states={states}
          styles={styles}
        />
        <View style={styles.contentContainer}>
          <MediaContent
            activeTab={states.activeTab}
            images={data.images}
            videos={data.videos}
            styles={styles}
            onRefresh={onRefresh}
            states={states}
          />
        </View>
      </View>
    </Container>
  );
};

export default Profile;

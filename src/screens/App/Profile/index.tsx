import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  VideoCard,
  CustomFlatList,
  Button,
  Container,
  CustomSimpleTab,
  ImagePreviewModal,
  VideoPreviewModal,
} from '@components/index';

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
  onEditProfile?: () => void;
  handleShareProfile?: () => void;
  onChatPress?: () => void; // ADDED
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
  onEditProfile,
  handleShareProfile,
  onChatPress,
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

          {!isExternalProfile && (
            <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
              <Image
                source={ICONS.Edit}
                style={styles.editIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
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
        <View style={styles.infoContainer}>
          <Text type="SEMIBOLD" style={styles.email}>
            {email}
          </Text>
          {mobileNo && (
            <Text type="REGULAR" style={styles.mobileNo}>
              {mobileNo}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={handleShareProfile}>
            <Image
              source={ICONS.Share}
              style={styles.shareIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {!isExternalProfile && (
            <TouchableOpacity onPress={onChatPress}>
              <Image
                source={ICONS.Chat}
                style={styles.shareIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
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

// ONLY CHANGED: Replaced TabBar with CustomSimpleTab
const TabBar: React.FC<{
  onTabChange: (tab: string) => void;
  states: object;
}> = ({ onTabChange, states }) => {
  const tabsData = [
    { id: 'images', title: 'Images' },
    { id: 'videos', title: 'Videos' },
  ];

  return (
    <CustomSimpleTab
      tabs={tabsData}
      activeTab={states?.activeTab}
      onTabChange={onTabChange}
    />
  );
};

// ONLY CHANGED: Added reels case in MediaContent
const MediaContent: React.FC<{
  activeTab: string;
  images: any[];
  videos: any[];
  onRefresh: () => void;
  states: object;
  styles: ReturnType<typeof useStyle>;
  onImagePress: (uri: string) => void;
  onVideoPress: (uri: string) => void;
}> = ({ activeTab, images, videos, styles, onImagePress, onVideoPress }) => {
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
        renderItem={({ item }: any) => (
          <VideoCard
            item={item}
            handleSelectStoredVideo={() => onVideoPress(item.videoURL)}
          />
        )}
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
      renderItem={({ item }: any) => (
        <TouchableOpacity onPress={() => onImagePress(item)}>
          <Image
            source={{ uri: item }}
            style={styles.mediaItem}
            resizeMode="cover"
          />
        </TouchableOpacity>
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
    onEditProfile,
    handleShareProfile,
    openImageModal,
    openVideoModal,
    closeModal,
  } = useProfile({
    userEmail: route.params?.email,
  });

  return (
    <Container showLoader={false} showBackArrow title="Profile">
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={states.refreshing}
            onRefresh={onRefresh}
          />
        }>
        <ProfileHeader
          email={data.email}
          firstName={data.firstName}
          lastName={data.lastName}
          profileImage={data.profileImage}
          mobileNo={data.mobileNo}
          images={data.images}
          videos={data.videos}
          styles={styles}
          isExternalProfile={isExternalProfile}
          navigateToMyFriends={navigateToMyFriends}
          isFriend={states.isFriend}
          relationStatus={states.relationStatus}
          handleSend={handleSend}
          handleAccept={handleAccept}
          handleReject={handleReject}
          onEditProfile={onEditProfile}
          handleShareProfile={handleShareProfile}
          states={states}
        />
        <View style={styles.tabContainer}>
          <TabBar onTabChange={states.setActiveTab} states={states} />
          <MediaContent
            activeTab={states.activeTab}
            images={data.images}
            videos={data.videos}
            styles={styles}
            onImagePress={openImageModal}
            onVideoPress={openVideoModal}
          />
        </View>

        {/* Image Preview Modal */}
        <ImagePreviewModal
          visible={states.imageModalVisible}
          imageUri={states.selectedImageUri}
          onClose={closeModal}
          hideActions={true}
        />

        {/* Video Preview Modal */}
        <VideoPreviewModal
          visible={states.videoModalVisible}
          videoUri={states.selectedVideoUri}
          onClose={closeModal}
          hideActions={true}
        />
      </ScrollView>
    </Container>
  );
};

export default Profile;

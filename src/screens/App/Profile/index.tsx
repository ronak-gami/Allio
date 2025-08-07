import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text, VideoCard, CustomFlatList } from '@components/index';
import useStyle from './style';
import { IMAGES } from '@assets/index';
import useProfile from './useProfile';

interface ProfileProps {
  email?: string;
}

const ProfileHeader: React.FC<{
  email: string;
  styles: ReturnType<typeof useStyle>;
}> = ({ email, styles }) => (
  <View style={styles.pictureContainer}>
    <Image source={IMAGES.Dummy_Profile} style={styles.image} />
    <Text type="SEMIBOLD" style={styles.email}>
      {email}
    </Text>
  </View>
);

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
  if (activeTab === 'videos') {
    return (
      <CustomFlatList
        key="videos"
        data={videos || []}
        renderItem={({ item }) => <VideoCard item={item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text type="BOLD" style={styles.emptyText}>
              No Videos Yet
            </Text>
          </View>
        }
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
      numColumns={3}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.imageGridRow}
      contentContainerStyle={styles.gridContent}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text type="BOLD" style={styles.emptyText}>
            No Images Yet
          </Text>
        </View>
      }
    />
  );
};

const Profile: React.FC<ProfileProps> = ({ email: propEmail }) => {
  const styles = useStyle();
  const { states, data } = useProfile({ userEmail: propEmail });

  return (
    <View style={styles.container}>
      <ProfileHeader email={data.email} styles={styles} />
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
  );
};

export default Profile;

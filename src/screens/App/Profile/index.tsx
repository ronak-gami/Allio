import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text, VideoCard, CustomFlatList } from '@components/index';
import useStyle from './style';
import { IMAGES } from '@assets/index';
import useProfile from './useProfile';

const Profile = () => {
  const styles = useStyle();
  const { email, images, videos, states } = useProfile();

  const renderContent = () => {
    if (states.activeTab === 'videos') {
      return (
        <CustomFlatList
          key="videos"
          data={videos || []}
          renderItem={({ item }) => <VideoCard item={item} />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
        />
      );
    } else {
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
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pictureContainer}>
        <Image source={IMAGES.Dummy_Profile} style={styles.image} />
        <Text type="SEMIBOLD" style={styles.email}>
          {email}
        </Text>
      </View>
      <View style={styles.contentHeader}>
        <TouchableOpacity
          style={[
            styles.tab,
            states.activeTab === 'images' && styles.activeTab,
          ]}
          onPress={() => states.setActiveTab('images')}>
          <Text
            style={[
              styles.tabText,
              states.activeTab === 'images' && styles.activeTabText,
            ]}>
            Images
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            states.activeTab === 'videos' && styles.activeTab,
          ]}
          onPress={() => states.setActiveTab('videos')}>
          <Text
            style={[
              styles.tabText,
              states.activeTab === 'videos' && styles.activeTabText,
            ]}>
            Videos
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

export default Profile;

import React from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@types/navigations';

import {
  Button,
  CustomFlatList,
  MediaCard,
  ImagePreviewModal,
  CustomChip,
  CustomLoader,
} from '@components/index';
import Text from '@components/atoms/Text';

import { ICONS } from '@assets/index';

import useStyle from './style';
import usePhotoMedia from './usePhotoMedia';

type Props = BottomTabScreenProps<TabParamList, 'Video'>;

const PhotoMedia: React.FC<Props> = () => {
  const {
    handleCameraOpen,
    handleSelectPhoto,
    handleClear,
    handleEdit,
    isPhotoLoaded,
    formatFileSize,
    getFormattedResolution,
    getPhotoFileName,
    hasValidPhotoAsset,
    openModal,
    closeModal,
    states,
  } = usePhotoMedia();

  const styles = useStyle();
  const { colors } = useTheme();

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={ICONS.gallery}
        style={styles.noGalleryIcon}
        resizeMode="contain"
      />
      <Text type="BOLD" style={styles.emptyStateTitle}>
        No Image Selected
      </Text>
      <Text
        type="REGULAR"
        style={[styles.emptyStateSubtitle, { color: colors.text }]}>
        Choose an image from your gallery or take a new one
      </Text>
    </View>
  );

  return (
    <>
      <CustomLoader visible={states?.loading} />

      {!states.loading && (
        <View style={styles.scrollcontainer}>
          <View style={styles.container}>
            <View style={isPhotoLoaded() ? styles.content : styles.contentNone}>
              {isPhotoLoaded() ? (
                <>
                  <View style={styles.headerView}>
                    <CustomChip
                      label="Edit"
                      bgColor={colors.primary}
                      onPress={handleEdit}
                    />
                    <CustomChip
                      label="Cancel"
                      outline
                      outlineColor={colors.primary}
                      onPress={handleClear}
                    />
                  </View>

                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: states.PhotoUri }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>

                  {hasValidPhotoAsset() && (
                    <View style={styles.videoInfoCard}>
                      <View style={styles.videoInfoHeader}>
                        <Text type="SEMIBOLD" style={styles.videoTitle}>
                          {getPhotoFileName(states?.PhotoAsset)}
                        </Text>
                      </View>
                      <View style={styles.videoStatsContainer}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Size</Text>
                          <Text type="SEMIBOLD" style={styles.statValue}>
                            {formatFileSize(states?.PhotoAsset?.fileSize)}
                          </Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statItem}>
                          <Text type="REGULAR" style={styles.statLabel}>
                            Resolution
                          </Text>
                          <Text type="SEMIBOLD" style={styles.statValue}>
                            {getFormattedResolution(states?.PhotoAsset)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <CustomFlatList
                    data={states?.images}
                    renderItem={({ item }) => (
                      <MediaCard
                        uri={item}
                        onLongPress={() => openModal(item)}
                      />
                    )}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    ListEmptyComponent={renderEmptyState}
                  />
                  <ImagePreviewModal
                    visible={states?.modalVisible}
                    onClose={closeModal}
                    imageUri={states?.selectedImage}
                    mediaType="photo"
                  />
                </>
              )}
            </View>

            {!isPhotoLoaded() && (
              <View style={styles.actionButtonContainer}>
                <Button title="Take Photo" onPress={handleCameraOpen} />
                <Button
                  title="Choose from Gallery"
                  onPress={handleSelectPhoto}
                  outlineColor={colors.primary}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default PhotoMedia;

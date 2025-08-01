import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Button } from '@components/index';
import Text from '@components/atoms/Text';
import CustomChip from '@components/atoms/CustomChip';
import { ICONS } from '@assets/index';

import { TabParamList } from '@types/navigations';
import useStyle from './style';
import usePhotoMedia from './usePhotoMedia';

type Props = BottomTabScreenProps<TabParamList, 'Video'>;

const PhotoMedia: React.FC<Props> = () => {
  const {
    PhotoUri,
    PhotoAsset,
    handleCameraOpen,
    handleSelectPhoto,
    handleClear,
    handleEdit,
    isPhotoLoaded,
    formatFileSize,

    getFormattedResolution,
    getPhotoFileName,
    hasValidPhotoAsset,
  } = usePhotoMedia();

  const styles = useStyle();
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollcontainer}
      showsHorizontalScrollIndicator={false}>
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
                  source={{ uri: PhotoUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              {hasValidPhotoAsset() && (
                <View style={[styles.videoInfoCard]}>
                  <View style={styles.videoInfoHeader}>
                    <Text type="SEMIBOLD" style={styles.videoTitle}>
                      {getPhotoFileName(PhotoAsset)}
                    </Text>
                  </View>
                  <View style={styles.videoStatsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Size</Text>
                      <Text type="SEMIBOLD" style={styles.statValue}>
                        {formatFileSize(PhotoAsset?.fileSize)}
                      </Text>
                    </View>

                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text type="REGULAR" style={styles.statLabel}>
                        Resolution
                      </Text>
                      <Text type="SEMIBOLD" style={styles.statValue}>
                        {getFormattedResolution(PhotoAsset)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </>
          ) : (
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
                Choose a Image from your gallery or Take a new one
              </Text>
            </View>
          )}
        </View>

        {!isPhotoLoaded() && (
          <View style={styles.actionButtonContainer}>
            <Button title="Take Photo " onPress={handleCameraOpen} />
            <Button
              title="Choose from Gallery"
              onPress={handleSelectPhoto}
              outlineColor={colors.primary}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PhotoMedia;

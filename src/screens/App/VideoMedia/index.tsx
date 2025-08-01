import React from 'react';
import { View, Image } from 'react-native';
import useStyle from './style';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@types/navigations';
import { Button } from '@components/index';
import useVideoMedia from './useVideoMedia';
import Video from 'react-native-video';
import Text from '@components/atoms/Text';
import { useTheme } from '@react-navigation/native';
import { ICONS } from '@assets/index';
import CustomChip from '@components/atoms/CustomChip';
import VideoSuccessModal from '@components/organisms/VideoSuccessModal';

type Props = BottomTabScreenProps<TabParamList, 'Video'>;

const VideoMedia: React.FC<Props> = () => {
  const {
    videoUri,
    videoAsset,
    handleRecordVideo,
    handleSelectVideo,
    handleClear,
    handleEdit,
    closeSuccessModal,
    isVideoLoaded,
    isSuccessModalOpen,
    formatFileSize,
    formatDuration,
    getFormattedResolution,
    getVideoFileName,
    hasValidVideoAsset,
    saveVisible,
    handleVideoSaveToGallery,
  } = useVideoMedia();

  const styles = useStyle();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={isVideoLoaded() ? styles.content : styles.contentNone}>
        {isVideoLoaded() ? (
          <>
            <View style={styles.headerView}>
              <CustomChip
                label={saveVisible ? 'Save' : 'Edit'}
                bgColor={colors.primary}
                onPress={
                  saveVisible
                    ? () => handleVideoSaveToGallery(videoUri)
                    : handleEdit
                }
              />
              <CustomChip
                label="Cancel"
                outline
                outlineColor={colors.primary}
                onPress={handleClear}
              />
            </View>

            <Video
              source={{ uri: videoUri }}
              style={styles.videoPlayer}
              controls={true}
              resizeMode="contain"
            />

            {hasValidVideoAsset() && (
              <View style={[styles.videoInfoCard]}>
                <View style={styles.videoInfoHeader}>
                  <Text type="SEMIBOLD" style={styles.videoTitle}>
                    {getVideoFileName(videoAsset)}
                  </Text>
                </View>
                <View style={styles.videoStatsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Size</Text>
                    <Text type="SEMIBOLD" style={styles.statValue}>
                      {formatFileSize(videoAsset?.fileSize)}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text type="REGULAR" style={styles.statLabel}>
                      Duration
                    </Text>
                    <Text type="SEMIBOLD" style={styles.statValue}>
                      {formatDuration(videoAsset?.duration)}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text type="REGULAR" style={styles.statLabel}>
                      Resolution
                    </Text>
                    <Text type="SEMIBOLD" style={styles.statValue}>
                      {getFormattedResolution(videoAsset)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Image
              source={ICONS.NoVideo}
              style={styles.NoVideoIcon}
              resizeMode="contain"
            />
            <Text type="BOLD" style={styles.emptyStateTitle}>
              No Video Selected
            </Text>
            <Text
              type="REGULAR"
              style={[styles.emptyStateSubtitle, { color: colors.text }]}>
              Choose a video from your gallery or record a new one
            </Text>
          </View>
        )}
      </View>

      {!isVideoLoaded() && (
        <View style={styles.actionButtonContainer}>
          <Button title="Record Video" onPress={handleRecordVideo} />
          <Button
            title="Choose from Gallery"
            onPress={handleSelectVideo}
            outlineColor={colors.primary}
          />
        </View>
      )}

      {/* Success Modal for Video Save */}
      <VideoSuccessModal
        visible={isSuccessModalOpen()}
        onClose={closeSuccessModal}
        hasValidVideoAsset={hasValidVideoAsset()}
      />
    </View>
  );
};

export default VideoMedia;

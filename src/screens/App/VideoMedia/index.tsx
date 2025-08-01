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
import CustomModal from '@components/atoms/CustomModel';
import CustomChip from '@components/atoms/CustomChip';

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
      <CustomModal
        visible={isSuccessModalOpen()}
        title="Video Saved Successfully!"
        description="Your video has been successfully saved to the gallery."
        onClose={closeSuccessModal}>
        <View style={styles.modalContent}>
          {hasValidVideoAsset() && (
            <>
              <Text type="SEMIBOLD" style={styles.modalVideoTitle}>
                Saved Video Details
              </Text>

              <View style={styles.modalStatCard}>
                <Text type="REGULAR" style={styles.modalStatLabel}>
                  File Name
                </Text>
                <Text type="SEMIBOLD" style={styles.modalStatValue}>
                  {getVideoFileName(videoAsset)}
                </Text>
              </View>

              <View style={styles.modalStatCard}>
                <Text type="REGULAR" style={styles.modalStatLabel}>
                  File Size
                </Text>
                <Text type="SEMIBOLD" style={styles.modalStatValue}>
                  {formatFileSize(videoAsset?.fileSize)}
                </Text>
              </View>

              <View style={styles.modalStatCard}>
                <Text type="REGULAR" style={styles.modalStatLabel}>
                  Duration
                </Text>
                <Text type="SEMIBOLD" style={styles.modalStatValue}>
                  {formatDuration(videoAsset?.duration)}
                </Text>
              </View>

              <View style={styles.modalStatCard}>
                <Text type="REGULAR" style={styles.modalStatLabel}>
                  Resolution
                </Text>
                <Text type="SEMIBOLD" style={styles.modalStatValue}>
                  {getFormattedResolution(videoAsset)}
                </Text>
              </View>

              <View style={styles.successMessage}>
                <Text type="REGULAR" style={styles.successText}>
                  Your video is now available in your device's gallery and can
                  be shared or viewed anytime.
                </Text>
              </View>
            </>
          )}
        </View>

        <Button title="OK" onPress={closeSuccessModal} />
      </CustomModal>
    </View>
  );
};

export default VideoMedia;

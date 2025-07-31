import React from 'react';
import { View, ScrollView, Image } from 'react-native';
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
    handleCompress,
    closeModel,
    isVideoLoaded,
    isModalOpen,
    formatFileSize,
    formatDuration,
    getFormattedResolution,
    getVideoFileName,
    getEstimatedCompressedSize,
    hasValidVideoAsset,
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

      <CustomModal
        visible={isModalOpen()}
        title="Video Compression"
        description="Compressing your video will reduce file size while maintaining quality."
        onClose={closeModel}>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}>
          {hasValidVideoAsset() ? (
            <>
              <Text type="SEMIBOLD" style={styles.modalVideoTitle}>
                Current Video Details
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

              <View style={styles.compressionPreview}>
                <Text type="MEDIUM" style={styles.compressionTitle}>
                  Estimated after compression
                </Text>
                <Text type="REGULAR" style={styles.compressionText}>
                  Size: ~{getEstimatedCompressedSize(videoAsset)}
                </Text>
                <Text type="REGULAR" style={styles.compressionText}>
                  Quality: High (recommended)
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.modalErrorState}>
              <Text type="SEMIBOLD" style={styles.modalErrorText}>
                No video information available
              </Text>
              <Text type="REGULAR" style={styles.modalErrorSubtext}>
                Please select a video first before compressing
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.modalActions}>
          <Button
            title="Compress Video"
            onPress={handleCompress}
            disabled={!hasValidVideoAsset()}
          />
        </View>
      </CustomModal>
    </View>
  );
};

export default VideoMedia;

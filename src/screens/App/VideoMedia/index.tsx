import React from 'react';
import {
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
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
import CustomLoader from '@components/atoms/CustomLoader';
import VideoPreviewModal from '@components/organisms/VideoPreviewModal';

type Props = BottomTabScreenProps<TabParamList, 'Video'>;

const VideoMedia: React.FC<Props> = () => {
  const {
    Videos_data,
    states,
    handleRecordVideo,
    handleSelectVideo,
    handleClear,
    handleEdit,
    closePreviewModal,
    isVideoLoaded,
    formatFileSize,
    formatDuration,
    getFormattedResolution,
    getVideoFileName,
    hasValidVideoAsset,
    handleSaveMedia,
    handleSelectStoredVideo,
    isPreviewModalOpen,
  } = useVideoMedia();

  const styles = useStyle();
  const { colors } = useTheme();

  const renderVideoGridItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleSelectStoredVideo(item)}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.gridItem}
        resizeMode="cover"
      />
      <Image
        source={ICONS.VideoPlay}
        style={styles.VideoPlayIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderVideoGrid = () => (
    <View style={styles.gridContainer}>
      {/* CORRECTED: Using `Videos_data` directly */}
      {Videos_data && Videos_data.length > 0 ? (
        <FlatList
          data={Videos_data}
          renderItem={renderVideoGridItem}
          removeClippedSubviews={false}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
        />
      ) : (
        <View style={styles.emptyGridContainer}>
          <Image
            source={ICONS.NoVideo}
            style={styles.emptyGridIcon}
            resizeMode="contain"
          />
          <Text type="BOLD" style={styles.emptyGridTitle}>
            No Videos Yet
          </Text>
          <Text type="REGULAR" style={styles.emptyGridSubtitle}>
            Start by recording a new video or choosing from gallery
          </Text>
        </View>
      )}
    </View>
  );

  const renderBottomButtons = () => (
    <View style={styles.bottomButtonsContainer}>
      <Button title="Record New" onPress={handleRecordVideo} />
      <Button
        title="Choose From Gallery"
        onPress={handleSelectVideo}
        outlineColor={colors.primary}
      />
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {isVideoLoaded() ? (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <View style={styles.headerView}>
                {/* `states` is used only for local state variables */}
                <CustomChip
                  label={states.saveVisible ? 'Save' : 'Edit'}
                  bgColor={colors.primary}
                  onPress={states.saveVisible ? handleSaveMedia : handleEdit}
                />
                <CustomChip
                  label="Cancel"
                  outline
                  outlineColor={colors.primary}
                  onPress={handleClear}
                />
              </View>

              <Video
                source={{ uri: states.videoUri }}
                style={styles.videoPlayer}
                controls={true}
                resizeMode="contain"
              />

              {hasValidVideoAsset() && (
                <View style={[styles.videoInfoCard]}>
                  <View style={styles.videoInfoHeader}>
                    <Text type="SEMIBOLD" style={styles.videoTitle}>
                      {getVideoFileName(states.videoAsset)}
                    </Text>
                  </View>
                  <View style={styles.videoStatsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Size</Text>
                      <Text type="SEMIBOLD" style={styles.statValue}>
                        {formatFileSize(states.videoAsset?.fileSize)}
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text type="REGULAR" style={styles.statLabel}>
                        Duration
                      </Text>
                      <Text type="SEMIBOLD" style={styles.statValue}>
                        {formatDuration(states.videoAsset?.duration)}
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text type="REGULAR" style={styles.statLabel}>
                        Resolution
                      </Text>
                      <Text type="SEMIBOLD" style={styles.statValue}>
                        {getFormattedResolution(states.videoAsset)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.mainContainer}>
            {renderVideoGrid()}
            {renderBottomButtons()}
          </View>
        )}

        <VideoPreviewModal
          visible={isPreviewModalOpen()}
          videoUri={states.previewVideoUri}
          videoTitle={states.previewVideoTitle}
          onClose={closePreviewModal}
        />
      </View>
      <CustomLoader visible={states.loading} />
    </>
  );
};

export default VideoMedia;

import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import Video from 'react-native-video';
import { TabParamList } from '@types/navigations';
import {
  Button,
  Container,
  CustomChip,
  CustomFlatList,
  CustomSimpleTab,
  Text,
  VideoCard,
  VideoPreviewModal,
} from '@components/index';
import { ICONS } from '@assets/index';
import useStyle from './style';
import useVideoMedia from './useVideoMedia';
import PhotoMedia from '../PhotoMedia';

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
    isPreviewModalOpen,
    handleSelectStoredVideo,
    onRefresh,
    onTabChange,
  } = useVideoMedia();

  const styles = useStyle();
  const { colors } = useTheme();

  const renderVideoGrid = () => (
    <View style={styles.gridContainer}>
      <CustomFlatList
        data={Videos_data || []}
        renderItem={({ item }) => (
          <VideoCard
            item={item}
            handleSelectStoredVideo={() => handleSelectStoredVideo(item)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        refreshing={states?.refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
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
        }
      />
    </View>
  );

  const renderBottomButtons = () => (
    <View style={styles.bottomButtonsContainer}>
      <Button
        title="Record New"
        onPress={handleRecordVideo}
        style={styles.buttonStyle}
      />
      <Button
        title="Choose From Gallery"
        onPress={handleSelectVideo}
        outlineColor={colors.primary}
        style={styles.buttonStyle}
      />
    </View>
  );

  const tabs = [
    { id: 0, title: 'Photos' },
    { id: 1, title: 'Videos' },
  ];

  const renderContent = () => {
    switch (states.activeTab) {
      case 0:
        return <PhotoMedia />;
      case 1:
        return (
          <View style={styles.container}>
            {isVideoLoaded() ? (
              <ScrollView
                style={styles.mainContainer}
                contentContainerStyle={styles.gridContent}>
                <View style={styles.content}>
                  <View style={styles.headerView}>
                    {/* `states` is used only for local state variables */}
                    <CustomChip
                      label={states.saveVisible ? 'Save' : 'Edit'}
                      bgColor={colors.primary}
                      onPress={
                        states.saveVisible ? handleSaveMedia : handleEdit
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
        );
      default:
        return null;
    }
  };

  return (
    <Container showLoader={states.loading} title="Social Media">
      <CustomSimpleTab
        tabs={tabs}
        activeTab={states?.activeTab}
        onTabChange={onTabChange}
      />
      {renderContent()}
    </Container>
  );
};

export default VideoMedia;

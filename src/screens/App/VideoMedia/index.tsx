import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import useStyle from './style';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@types/navigations';
import { Button } from '@components/index';
import useVideoMedia from './useVideoMedia';
import Video from 'react-native-video';
import Text from '@components/atoms/Text';
import { useTheme } from '@react-navigation/native';
import CustomIcon from '@components/atoms/EditIcon';
import { ICONS } from '@assets/index';
import CustomModal from '@components/atoms/CustomModel';

type Props = BottomTabScreenProps<TabParamList, 'Video'>;

const VideoMedia: React.FC<Props> = () => {
  const {
    videoUri,
    handleRecordVideo,
    handleSelectVideo,
    handleClear,
    handleEdit,
    editable,
    openModel,
    closeModel,
    model,
  } = useVideoMedia();
  const styles = useStyle();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={videoUri ? styles.content : styles.contentNone}>
        {videoUri ? (
          <>
            <View style={styles.headerView}>
              <TouchableOpacity onPress={handleClear}>
                <Text type="SEMIBOLD" style={styles.headerText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit}>
                <Text type="SEMIBOLD" style={styles.headerText}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
            <Video
              source={{ uri: videoUri }}
              style={styles.videoPlayer}
              controls={true}
              resizeMode="contain"
            />
          </>
        ) : (
          <Text type="BOLD" style={styles.placeholderText}>
            No video selected.
          </Text>
        )}
      </View>
      {editable && (
        <View style={styles.editIconView}>
          <CustomIcon icon={ICONS.compressed} onPress={openModel} />
          <CustomIcon icon={ICONS.compressed} onPress={openModel} />
          <CustomIcon icon={ICONS.compressed} onPress={openModel} />
        </View>
      )}
      {videoUri ? null : (
        <View style={styles.buttonContainer}>
          <Button
            title="Open Camera"
            onPress={handleRecordVideo}
            outlineColor={colors.primary}
          />
          <Button
            title="Pick From Gallery"
            onPress={handleSelectVideo}
            outlineColor={colors.primary}
          />
        </View>
      )}
      <CustomModal
        visible={model}
        title="Confirm Compression"
        description="Are you sure you want to compress your uploaded video?"
        onClose={closeModel}>
        <Button title="Yes" onPress={closeModel} />
      </CustomModal>
    </View>
  );
};

export default VideoMedia;

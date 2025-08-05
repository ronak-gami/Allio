import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import CustomModal from '@components/atoms/CustomModel';
import useStyle from './style';
import Video from 'react-native-video';
import { ICONS } from '@assets/index';
import useVideoPreviewModal from './useVideoPreviewModal';

interface VideoPreviewModalProps {
  visible: boolean;
  videoUri?: string | null;
  videoTitle?: string;
  onClose?: () => void;
}

const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  visible,
  videoUri,
  videoTitle = 'Video Preview',
  onClose,
}) => {
  const styles = useStyle();
  const { handleMediaSaveToGallery, loading, handleVideoShare } =
    useVideoPreviewModal();

  return (
    <CustomModal
      visible={visible}
      title={videoTitle}
      onClose={onClose}
      loading={loading}>
      <View style={styles.videoModalContent}>
        {videoUri && (
          <Video
            source={{ uri: videoUri }}
            style={styles.modalVideoPlayer}
            controls={true}
            resizeMode="contain"
            paused={!visible}
          />
        )}
      </View>
      <View style={styles.iconsView}>
        <TouchableOpacity onPress={() => handleMediaSaveToGallery(videoUri)}>
          <Image source={ICONS.Download} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ICONS.Send} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleVideoShare(videoUri)}>
          <Image source={ICONS.Share} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

export default VideoPreviewModal;

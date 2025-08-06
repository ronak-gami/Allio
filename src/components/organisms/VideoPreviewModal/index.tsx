import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import CustomModal from '@components/atoms/CustomModel';
import Video from 'react-native-video';
import { ICONS } from '@assets/index';
import { handleMediaDownload, handleMediaShare } from '@utils/helper';
import useStyle from './style';

interface VideoPreviewModalProps {
  visible: boolean;
  videoUri?: string | undefined;
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

  return (
    <CustomModal visible={visible} title={videoTitle} onClose={onClose}>
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
        <TouchableOpacity
          onPress={() => handleMediaDownload(videoUri, 'video')}>
          <Image source={ICONS.Download} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ICONS.Send} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMediaShare(videoUri, 'video')}>
          <Image source={ICONS.Share} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

export default VideoPreviewModal;

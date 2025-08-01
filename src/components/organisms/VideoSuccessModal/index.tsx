import React from 'react';
import { View } from 'react-native';
import CustomModal from '@components/atoms/CustomModel';
import { Button } from '@components/index';
import Text from '@components/atoms/Text';
import useStyle from './style';

interface VideoAsset {
  fileSize?: number;
  duration?: number;
  width?: number;
  height?: number;
  fileName?: string;
}

interface VideoSuccessModalProps {
  visible: boolean;
  videoAsset: VideoAsset | null;
  onClose?: () => void;
  formatFileSize?: (size?: number) => string;
  formatDuration?: (duration?: number) => string;
  getFormattedResolution?: (asset: VideoAsset | null) => string;
  getVideoFileName?: (asset: VideoAsset | null) => string;
  hasValidVideoAsset: boolean;
}

const VideoSuccessModal: React.FC<VideoSuccessModalProps> = ({
  visible,
  onClose,
  hasValidVideoAsset,
}) => {
  const styles = useStyle();

  return (
    <CustomModal
      visible={visible}
      title="Video Saved Successfully!"
      description="Your video has been successfully saved to the gallery."
      onClose={onClose}>
      <View style={styles.modalContent}>
        {hasValidVideoAsset && (
          <View style={styles.successMessage}>
            <Text type="REGULAR" style={styles.successText}>
              Your video is now available in your device's gallery and can be
              shared or viewed anytime.
            </Text>
          </View>
        )}
      </View>

      <Button title="OK" onPress={onClose} />
    </CustomModal>
  );
};

export default VideoSuccessModal;

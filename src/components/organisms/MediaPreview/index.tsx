import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

import { ICONS } from '@assets/index';
import CustomModal from '@components/atoms/CustomModel';
import { handleMediaDownload, handleMediaShare } from '@utils/helper';
import useStyle from './style';

interface Props {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  mediaType?: 'photo' | 'video';
}

const MediaPreview: React.FC<Props> = ({
  visible,
  imageUri,
  onClose,
  mediaType = 'photo',
}) => {
  const styles = useStyle();

  const handleDownload = () => {
    handleMediaDownload(imageUri, mediaType);
  };

  const handleShare = () => {
    handleMediaShare(imageUri, mediaType);
  };

  const handleSend = () => {};

  return (
    <CustomModal visible={visible} onClose={onClose} title="Image Preview">
      <Image source={{ uri: imageUri }} style={styles.modalImage} />

      <View style={styles.iconRow}>
        <TouchableOpacity onPress={handleDownload}>
          <Image source={ICONS.Download} style={styles.iconImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSend}>
          <Image source={ICONS.Send} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Image source={ICONS.Share} style={styles.iconImage} />
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

export default MediaPreview;

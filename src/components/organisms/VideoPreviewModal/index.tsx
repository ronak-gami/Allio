import React, { memo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Video from 'react-native-video';

import { RootState } from '@redux/store';
import Button from '@components/atoms/Button';
import Text from '@components/atoms/Text';
import CustomLoader from '@components/atoms/CustomLoader';
import FlatList from '@components/atoms/FlatList';
import CustomModal from '@components/atoms/CustomModel';

import { ICONS } from '@assets/index';
import useStyle from './style';
import { useVideoPreviewModal } from './useVideoPreviewModal';

interface VideoPreviewModalProps {
  visible: boolean;
  videoUri: string;
  onClose: () => void;
}

const VideoPreviewModal = ({
  visible,
  videoUri,
  onClose,
}: VideoPreviewModalProps) => {
  const styles = useStyle();

  const myEmail: string | null | undefined = useSelector(
    (state: RootState) => state.auth?.userData?.email,
  );

  const {
    friends,
    loading,
    handleSend,
    handleShare,
    handleDownload,
    mode,
    selectedFriends,
    handleSendToFriends,
    toggleSelect,
  } = useVideoPreviewModal(myEmail, videoUri, 'video', onClose);

  // 🔹 Extracted item renderer
  const renderVideoItem = ({ item }: any) => {
    const showImage = !!item?.profile;
    const firstLetter: string =
      item?.firstName?.charAt(0)?.toUpperCase() || '?';

    const isSelected = selectedFriends.includes(item.email);

    return (
      <TouchableOpacity
        style={styles.friendsList}
        onPress={() => toggleSelect(item?.email)}>
        {showImage ? (
          <Image
            source={{ uri: item?.profile }}
            style={[
              styles.profileImage,
              {
                borderWidth: isSelected ? 2 : 0,
                borderColor: 'blue',
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              {
                borderWidth: isSelected ? 2 : 0,
                borderColor: 'white',
              },
            ]}>
            <Text style={styles.placeholderText}>{firstLetter}</Text>
          </View>
        )}
        <Text style={styles.placeholderText1}>{item?.firstName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title="Video Preview">
      <View style={styles.videoModalContent}>
        {videoUri && (
          <Video
            source={{ uri: videoUri }}
            style={styles.modalVideoPlayer}
            controls
            resizeMode="contain"
            paused={!visible}
          />
        )}
      </View>

      {mode === 'friends' ? (
        <View>
          <Text type="BOLD" style={styles.selectText}>
            Select Friends
          </Text>
          {loading ? (
            <CustomLoader visible />
          ) : (
            <FlatList
              numColumns={3}
              data={friends}
              keyExtractor={(item: { email: string }) => item?.email}
              renderItem={renderVideoItem}
            />
          )}
          <Button
            title="Send Friends"
            onPress={handleSendToFriends}
            style={styles.sendButton}
          />
        </View>
      ) : (
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
      )}
    </CustomModal>
  );
};

export default memo(VideoPreviewModal);

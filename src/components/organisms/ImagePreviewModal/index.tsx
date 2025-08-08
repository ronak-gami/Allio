import React, { memo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '@redux/store';

import Button from '@components/atoms/Button';
import Text from '@components/atoms/Text';
import CustomLoader from '@components/atoms/CustomLoader';
import FlatList from '@components/atoms/FlatList';
import CustomModal from '@components/atoms/CustomModel';

import { ICONS } from '@assets/index';
import useStyle from './style';
import { useFriendsList } from './useFriendsList';
interface MediaPreviewProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  mediaType?: 'photo' | 'video';
}

const MediaPreview = ({
  visible,
  imageUri,
  onClose,
  mediaType = 'photo',
}: MediaPreviewProps) => {
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
  } = useFriendsList(myEmail, imageUri, mediaType, onClose);

  return (
    <CustomModal visible={visible} onClose={onClose} title="Image Preview">
      <Image source={{ uri: imageUri }} style={styles.modalImage} />
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
              keyExtractor={(item: { email: any; }) => item?.email}
              renderItem={({ item }: any) => {
                const showImage = item?.profile && item?.profile !== '';
                const firstLetter: string =
                  item?.firstName?.charAt(0)?.toUpperCase() || '?';
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
                            borderWidth: selectedFriends.includes(item.email)
                              ? 2
                              : 0,
                            borderColor: 'blue',
                          },
                        ]}
                      />
                    ) : (
                      <View
                        style={[
                          styles.placeholder,
                          {
                            borderWidth: selectedFriends.includes(item.email)
                              ? 2
                              : 0,
                            borderColor: 'white',
                          },
                        ]}>
                        <Text style={styles.placeholderText}>
                          {firstLetter}
                        </Text>
                      </View>
                    )}

                    <Text style={styles.placeholderText1}>
                      {item?.firstName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
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

export default memo(MediaPreview);

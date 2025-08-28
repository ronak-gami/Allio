import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import Text from '@components/atoms/Text';
import { ICONS } from '@assets/index';
import useStyle from './style';
import { useUserCard as useRelationCard } from './useUserCard';

interface UserCardProps {
  user: any;
  drag?: () => void;
  isActive?: boolean;
  isFriendTab?: boolean;
  pinnedUsers?: string[];
  onPin?: (email: string) => void;
  onUnpin?: (email: string) => void;
  onLongPressUser?: (user: any) => void;
  selectedUser?: any;
  onDragThreshold?: (user: any) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  drag,
  isActive,
  isFriendTab,
  pinnedUsers,
  onPin,
  onUnpin,
  onLongPressUser,
  selectedUser,
  onDragThreshold,
}) => {
  const styles = useStyle();
  const myEmail = useSelector(
    (state: RootState) => state.auth?.userData?.email,
  );

  const showImage = user?.profileImage && user?.profileImage.trim() !== '';
  const firstLetter: string = user?.firstName?.charAt(0)?.toUpperCase() || '?';
  const isPinned = pinnedUsers?.includes(user.email);

  const {
    relationStatus,
    handleSend,
    handleAccept,
    handleReject,
    states,
    dragVisible,
    panResponder,
    handlePress,
    handlePressPin,
  } = useRelationCard(
    myEmail,
    user?.email,
    user,
    isPinned,
    selectedUser,
    onDragThreshold,
    onPin,
    onUnpin,
  );

  const renderAction = () => {
    if (relationStatus === 'accepted') return null;
    if (relationStatus === 'sent')
      return (
        <View style={styles.pendingChip}>
          <Text style={styles.pendingText} type="semibold">
            Pending
          </Text>
        </View>
      );
    if (relationStatus === 'received')
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.send} onPress={handleAccept}>
            <Image source={ICONS.true} style={styles.iconimage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.send} onPress={handleReject}>
            <Image source={ICONS.false} style={styles.iconimage} />
          </TouchableOpacity>
        </View>
      );
    return (
      <TouchableOpacity style={styles.send} onPress={handleSend}>
        <Image source={ICONS.Send} style={styles.iconimage1} />
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      onLongPress={() => {
        if (!isPinned && isFriendTab) {
          onLongPressUser?.(user);
          drag?.(); // start dragging on long press
        }
      }}>
      <View
        {...panResponder.panHandlers}
        style={[styles.card, isActive && { opacity: 0.7 }]}>
        <View style={styles.row}>
          {dragVisible && isFriendTab && (
            <View style={styles.dragIconWrapper}>
              <Image source={ICONS.drag} style={styles.dragIcon} />
            </View>
          )}

          {showImage ? (
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{firstLetter}</Text>
            </View>
          )}

          <View style={styles.userInfo}>
            <View style={styles.topRow}>
              <Text style={styles.name}>{user?.firstName || 'Unknown'}</Text>

              {(isPinned || dragVisible) && isFriendTab && (
                <TouchableOpacity
                  style={styles.actionIconWrapper}
                  onPress={handlePressPin}>
                  <Image source={ICONS.Attach} style={styles.actionIcon} />
                </TouchableOpacity>
              )}
            </View>

            {states?.lastMessage && (
              <View style={styles.bottomRow}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {states?.lastMessage}
                </Text>
                {states?.lastMessageDate && (
                  <Text style={styles.lastMessageDate}>
                    {states?.lastMessageDate}
                  </Text>
                )}
              </View>
            )}
          </View>

          {!isFriendTab && (
            <View style={{ marginLeft: 8 }}>{renderAction()}</View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UserCard;

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

  const isSelf =
    (myEmail || '').trim().toLowerCase() ===
    (user?.email || '').toString().trim().toLowerCase();

  const showImage = user?.profileImage && user?.profileImage.trim() !== '';
  const firstLetter: string = isSelf
    ? 'Y'
    : user?.firstName?.charAt(0)?.toUpperCase() ||
      user?.email?.charAt(0)?.toUpperCase() ||
      '?';
  const isPinned = pinnedUsers?.includes(user.email);

  const {
    relationStatus,
    handleSend,
    handleAccept,
    handleReject,
    states,
    dragVisible,
    attachVisible, 
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

  // Add double-tap support to reveal attach icon by selecting the user
  const lastTapRef = React.useRef<number>(0);
  const singleTapTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleCardPressDoubleAware = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (singleTapTimeoutRef.current) {
        clearTimeout(singleTapTimeoutRef.current);
        singleTapTimeoutRef.current = null;
      }
      // Double-tap: ONLY show attach icon (no drag)
      if (!isPinned && isFriendTab) {
        onLongPressUser?.({ ...user, selectType: 'attach' });
      }
      return;
    }

    lastTapRef.current = now;
    singleTapTimeoutRef.current = setTimeout(() => {
      handlePress(); // Single tap -> open chat
      singleTapTimeoutRef.current = null;
    }, DOUBLE_TAP_DELAY);
  };

  const displayName = isSelf
    ? 'You'
    : user?.firstName || user?.email || 'Unknown';

  const renderAction = () => {
    // Hide actions for self
    if (isSelf) return null;

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
      onPress={handleCardPressDoubleAware}
      onLongPress={() => {
        if (!isPinned && isFriendTab) {
          // Long-press: ONLY show drag (no attach)
          onLongPressUser?.({ ...user, selectType: 'drag' });
          drag?.();
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
              <Text style={styles.name}>{displayName}</Text>

              {(isPinned || attachVisible) && isFriendTab && (
                <TouchableOpacity
                  style={styles.actionIconWrapper}
                  onPress={handlePressPin}>
                  <Image source={ICONS.Attach} style={styles.actionIcon} />
                </TouchableOpacity>
              )}
            </View>

            {isFriendTab &&
              (states?.lastMessage || states?.lastMessageDate) && (
                <View style={styles.bottomRow}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {states?.lastMessage}
                  </Text>

                  {states?.lastMessageDate && !dragVisible && (
                    <Text style={styles.lastMessageDate}>
                      {states.lastMessageDate}
                    </Text>
                  )}
                </View>
              )}
          </View>

          {/* All tab right side: self shows share icon; others show request actions */}
          {!isFriendTab && (
            <View>
              {isSelf ? (
                <Image source={ICONS.share} style={styles.iconimage1} />
              ) : (
                <View>{renderAction()}</View>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UserCard;

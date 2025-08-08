import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { showSuccess, showError } from '@utils/toast';
import { ICONS } from '@assets/index';
import Text from '@components/atoms/Text';
import useStyle from './style';
import { useUserCard } from './useUserCard';
import { useNavigation } from '@react-navigation/native';
import { HOME } from '@utils/constant';

const UserCard = ({ user }: { user: any }) => {
  const navigation = useNavigation();
  const styles = useStyle();
  const myEmail: string | null | undefined = useSelector(
    (state: RootState) => state.auth?.userData?.email,
  );

  const showImage = user?.profile && user?.profile !== '';
  const firstLetter: string = user?.firstName?.charAt(0)?.toUpperCase() || '?';

  const { relationStatus, sendRequest, acceptRequest, rejectRequest } =
    useUserCard(myEmail, user?.email);

  const handleSend = async () => {
    try {
      await sendRequest();
      showSuccess('Friend request sent');
    } catch (error) {
      console.error('Send Error:', error);
      showError('Failed to send request');
    }
  };

  const handleAccept = async () => {
    try {
      await acceptRequest();
      showSuccess('Friend request accepted');
    } catch (error) {
      console.error('Accept Error:', error);
      showError('Failed to accept request');
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest();
      showSuccess('Friend request rejected');
    } catch (error) {
      console.error('Reject Error:', error);
      showError('Failed to reject request');
    }
  };

  const renderAction = () => {
    if (relationStatus === 'accepted') {
      return (
        <View style={styles.acceptedChip}>
          <Text style={styles.acceptedText}>Accepted</Text>
        </View>
      );
    }

    if (relationStatus === 'sent') {
      return (
        <View style={styles.pendingChip}>
          <Text style={styles.pendingText}>Pending</Text>
        </View>
      );
    }

    if (relationStatus === 'received') {
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
    }

    return (
      <TouchableOpacity style={styles.send} onPress={handleSend}>
        <Image source={ICONS.Send} style={styles.iconimage1} />
      </TouchableOpacity>
    );
  };
  const handlePress = () => {
    navigation.navigate(HOME.ChatDetailsScreen, { user });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.row}>
          {showImage ? (
            <Image source={{ uri: user.profile }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{firstLetter}</Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user.firstName || 'Unknown'}</Text>
            <Text style={styles.email}>{user.email || 'Unknown'}</Text>
          </View>
          {renderAction()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

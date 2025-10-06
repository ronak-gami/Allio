import React, { useMemo, useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import useStyles from './styles';
import { getUserData } from '@utils/helper';
import { Container } from '@components/index';
import { ICONS } from '@assets/index';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

const RingingCall = ({ call, toUser }: any) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();
  const [userData, setUserData] = useState<any>(null);
  const myEmail = useSelector(
    (state: RootState) => state.auth?.userData?.email,
  );

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        if (myEmail && isMounted) {
          const data = await getUserData(myEmail);
          if (isMounted) {
            setUserData(data);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (isMounted) {
          setUserData(null);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [myEmail]);

  const receiver = useMemo(() => {
    return call?.state?.members?.find?.(
      (p: any) => p?.id !== userData?.getStreamUserId,
    );
  }, [call, userData]);

  const handleAcceptCall = async () => {
    try {
      console.log('Attempting to join call:', {
        callId: call?.id,
        callType: call?.type,
        members: call?.state?.members?.length,
        currentUser: userData?.getStreamUserId,
      });

      // Try joining without going live first
      await call.join({
        audio: true,
        video: false,
      });

      console.log('Successfully joined call');

      // Enable microphone after successful join
      call.microphone?.enable();

      // For default call type, we might not need to go live
      // Only try going live if the method exists and it's needed
      if (call.goLive && call?.type === 'audio_room') {
        try {
          await call.goLive();
          console.log('Successfully went live');
        } catch (liveError) {
          console.warn(
            'Failed to go live, but call joined successfully:',
            liveError,
          );
          // Don't fail the entire call if goLive fails
        }
      }
    } catch (error: any) {
      console.error('Error joining call:', error);

      // Check if it's a Stream API permission error
      const errorMessage = error?.message || error?.toString() || '';
      if (
        errorMessage.includes('not allowed to perform action') ||
        errorMessage.includes('JoinBackstage') ||
        errorMessage.includes('403')
      ) {
        Alert.alert(
          'Call Permission Error',
          'You do not have permission to join this call. This appears to be a server configuration issue. Please contact support.',
        );
      } else {
        Alert.alert(
          'Error',
          'Unable to join call. Please check your permissions and try again.',
        );
      }
    }
  };

  const handleRejectCall = () => {
    call.leave();
  };

  return (
    <Container title="">
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>
          {call?.isCreatedByMe ? t('outGoingCall') : t('incomingCall')}
        </Text>

        <Image
          style={styles.image}
          source={{
            uri: call?.isCreatedByMe
              ? `${process.env.IMAGE_URL}${toUser?.photos?.[0]}`
              : receiver?.user?.image,
          }}
        />

        <Text style={[styles.title, { color: colors.primary }]}>
          {call?.isCreatedByMe ? toUser?.name : receiver?.user?.name}
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleRejectCall}
            activeOpacity={0.7}
            style={[
              styles.rejectButton,
              { backgroundColor: colors.background },
            ]}>
            <Image
              source={ICONS.cancel}
              style={[styles.buttonIcon, { tintColor: colors.primary }]}
            />
          </TouchableOpacity>

          {!call?.isCreatedByMe && (
            <TouchableOpacity
              onPress={handleAcceptCall}
              activeOpacity={0.7}
              style={[
                styles.acceptButton,
                { backgroundColor: colors.primary },
              ]}>
              <Image
                source={ICONS.voiceCall}
                style={[styles.buttonIcon, { tintColor: colors.primary }]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Container>
  );
};

export default RingingCall;

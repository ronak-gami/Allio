import React, { useEffect, useMemo, useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

import useStyles from './styles';
import { Container } from '@components/index';
import { ICONS } from '@assets/index';
import { getUserData } from '@utils/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

const formatTime = (seconds: number) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  const format = date.toISOString();
  const hours = format.substring(11, 13);
  const minutes = format.substring(14, 16);
  const seconds_str = format.substring(17, 19);
  return `${hours !== '00' ? hours + ':' : ''}${minutes}:${seconds_str}`;
};

const OnGoingCall = ({ call, toUser }: any) => {
  const [elapsed, setElapsed] = useState<string>('00:00');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const { colors } = useTheme();
  const styles = useStyles();

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

  const session = call?.state?.session;
  const startedAt = session?.started_at;

  // Get the display name and image for the other participant
  const getOtherParticipant = () => {
    // If I created the call (outgoing call)
    if (call?.isCreatedByMe && toUser) {
      return {
        name: toUser?.name || 'Unknown User',
        image: toUser?.photos?.[0]
          ? `${process.env.IMAGE_URL}${toUser?.photos?.[0]}`
          : null,
      };
    }

    // If I'm receiving the call (incoming call)
    // Find the caller from call members
    const caller = call?.state?.members?.find(
      (member: any) => member.user?.id !== userData?.getStreamUserId,
    );

    if (caller?.user) {
      return {
        name: caller.user.name || 'Unknown User',
        image: caller.user.image || null,
      };
    }

    // Fallback
    return {
      name: 'Audio Call',
      image: null,
    };
  };

  const otherParticipant = useMemo(() => {
    if (!userData) return { name: 'Loading...', image: null };
    return getOtherParticipant();
  }, [call, userData, toUser]);

  // Set call start time when session starts
  useEffect(() => {
    if (startedAt && !callStartTime) {
      const date = new Date(startedAt).getTime();
      if (!isNaN(date)) {
        setCallStartTime(date);
      } else {
        setCallStartTime(Date.now());
      }
    } else if (!callStartTime) {
      // If no startedAt yet, use current time as fallback
      setCallStartTime(Date.now());
    }
  }, [startedAt]);

  // Update elapsed time
  useEffect(() => {
    if (!callStartTime) {
      return;
    }

    // Calculate initial elapsed time
    const updateElapsed = () => {
      const elapsedSeconds = Math.max(0, (Date.now() - callStartTime) / 1000);
      setElapsed(formatTime(elapsedSeconds));
    };

    // Update immediately
    updateElapsed();

    // Then update every second
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [callStartTime]);

  useEffect(() => {
    if (call?.isCreatedByMe) {
      call.microphone?.enable();
    }
  }, [call]);

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      call.microphone?.enable();
    } else {
      call.microphone?.disable();
    }
  };

  const handleHangup = () => {
    try {
      // Always end the call for everyone when hanging up
      call.endCall();
    } catch (error) {
      console.error('Error ending call:', error);
      // Fallback to leave if endCall fails
      call.leave();
    }
  };

  return (
    <Container title="">
      <View style={styles.container}>
        {/* User Profile Image */}

        {/* User Name */}
        <Text
          style={[styles.title, { color: colors.primary }]}
          numberOfLines={2}>
          {otherParticipant.name}
        </Text>

        {/* Call Duration */}
        <Text style={[styles.duration, { color: colors.primary }]}>
          {elapsed}
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleMute}
            activeOpacity={0.7}
            style={[
              styles.muteButton,
              { backgroundColor: isMuted ? colors.background : colors.primary },
            ]}>
            <Image
              source={isMuted ? ICONS.mute : ICONS.unmute}
              style={styles.buttonIconMute}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleHangup}
            activeOpacity={0.7}
            style={styles.hangupButton}>
            <Image
              source={ICONS.cancel}
              style={[styles.buttonIcon, { tintColor: colors.primary }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default OnGoingCall;

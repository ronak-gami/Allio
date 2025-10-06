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

  // Mock participants and session for this example
  const participants = call?.state?.members || [];
  const receiver = participants?.find?.(
    (p: any) => p?.id !== userData?.getStreamUserId,
  );
  const session = call?.state?.session;
  const startedAt = session?.started_at;

  const startedAtDate = useMemo(() => {
    if (!startedAt) {
      return Date.now();
    }
    const date = new Date(startedAt).getTime();
    return isNaN(date) ? Date.now() : date;
  }, [startedAt]);

  useEffect(() => {
    const initialElapsedSeconds = Math.max(
      0,
      (Date.now() - startedAtDate) / 1000,
    );
    setElapsed(formatTime(initialElapsedSeconds));
    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAtDate) / 1000;
      setElapsed(formatTime(elapsedSeconds));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAtDate]);

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
        <Text style={{ color: colors.primary }}>{elapsed}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleMute}
            activeOpacity={0.7}
            style={[
              styles.muteButton,
              { backgroundColor: isMuted ? colors.background : colors.primary },
            ]}>
            <Image
              source={isMuted ? ICONS.voiceCall : ICONS.voiceCall}
              style={[styles.buttonIcon, { tintColor: colors.primary }]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleHangup}
            activeOpacity={0.7}
            style={[styles.hangupButton, { backgroundColor: colors.primary }]}>
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

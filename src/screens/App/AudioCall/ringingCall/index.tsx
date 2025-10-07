import React, { useMemo, useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import useStyles from './styles';
import { getUserData } from '@utils/helper';
import { Container } from '@components/index';
import { ICONS } from '@assets/index';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

const RingingCall = ({ call, toUser }: any) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
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
      await call.join({ audio: true, video: false });

      await call.microphone?.enable();
    } catch (err) {
      console.error('Error joining call:', err);
    }
  };

  const handleRejectCall = () => {
    try {
      if (call?.isCreatedByMe) {
        // If I created the call, end it for everyone
        call.endCall();
      } else {
        // If I'm receiving the call, reject it (this will end it for the caller too)
        call.reject();
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error ending/rejecting call:', error);
      navigation.goBack();
    }
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
            style={[styles.rejectButton]}>
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
              <Image source={ICONS.phone} style={styles.buttonIcon2} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Container>
  );
};

export default RingingCall;

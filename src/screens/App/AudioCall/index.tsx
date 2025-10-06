import React, { useEffect, useState } from 'react';
import {
  StreamCall,
  StreamVideo,
  useCalls,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import OnGoingCall from './onGoingCall';
import RingingCall from './ringingCall';
import { Text } from '@components/index';

const AudioCall = ({ route }) => {
  const [loaded, setLoaded] = useState(false);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [user, setUser] = useState(route?.params?.toUser);

  const { t } = useTranslation();

  useEffect(() => {
    if (route?.params?.toUser) {
      setUser(route.params.toUser);
    }
  }, [route?.params?.toUser]);

  const navigation = useNavigation();
  const client = useStreamVideoClient();
  const calls = useCalls();
  const call = calls[0];

  useEffect(() => {
    if (!call) return;

    const unsubscribeAccepted = call.on('call.accepted', ({}) => {
      setAccepted(true);
    });

    const unsubscribeEnded = call.on('call.ended', ({}) => {
      navigation.goBack();
    });

    const unsubscribeRejected = call.on('call.rejected', ({}) => {
      navigation.goBack();
    });

    const unsubscribeLeft = call.on('call.session_participant_left', event => {
      // If all participants have left, navigate back
      const remainingParticipants = call?.state?.participants?.length || 0;
      if (remainingParticipants <= 1) {
        navigation.goBack();
      }
    });

    return () => {
      unsubscribeAccepted();
      unsubscribeEnded();
      unsubscribeRejected();
      unsubscribeLeft();
    };
  }, [call]);

  useEffect(() => {
    if (!call && loaded) {
      navigation.goBack();
    }
    if (call && !loaded) {
      setLoaded(true);
    }
  }, [call]);

  if (!call) {
    return <Text label={t('callNotFound')} />;
  }

  if (!client) {
    return <Text label={t('callServiceNotAvailable')} />;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        {call?.state?.callingState === 'ringing' && !accepted && (
          <RingingCall call={call} toUser={user} />
        )}

        {accepted && <OnGoingCall call={call} toUser={user} />}
      </StreamCall>
    </StreamVideo>
  );
};

export default AudioCall;

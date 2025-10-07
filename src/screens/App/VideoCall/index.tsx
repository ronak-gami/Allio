import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {
  StreamCall,
  StreamVideo,
  RingingCallContent,
  useCalls,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { useNavigation } from '@react-navigation/native';

import useStyles from './styles';

const VideoCall = () => {
  const [loaded, setLoaded] = useState(false);

  const styles = useStyles();
  const navigation = useNavigation();
  const client = useStreamVideoClient();

  const calls = useCalls();
  const call = calls[0];

  useEffect(() => {
    if (!call && loaded) {
      return navigation.goBack();
    }
    if (call && !loaded) {
      setLoaded(true);
    }
  }, [call, loaded, navigation]);

  useEffect(() => {
    if (!call) {
      return;
    }

    const unsubscribeAccepted = call.on('call.accepted', () => {
      setLoaded(true);
    });

    const unsubscribeEnded = call.on('call.ended', () => {
      navigation.goBack();
    });

    const unsubscribeRejected = call.on('call.rejected', () => {
      navigation.goBack();
    });

    const unsubscribeParticipantLeft = call.on(
      'call.session_participant_left',
      () => {
        const remainingParticipants = call?.state?.participants?.length || 0;
        if (remainingParticipants <= 1) {
          navigation.goBack();
        }
      },
    );

    return () => {
      unsubscribeAccepted();
      unsubscribeEnded();
      unsubscribeRejected();
      unsubscribeParticipantLeft();
    };
  }, [call, navigation]);

  if (!call) {
    return <Text>Not found</Text>;
  }

  if (!client) {
    return <Text>Call service not available</Text>;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <View style={styles.container}>
          <RingingCallContent />
        </View>
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCall;

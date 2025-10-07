import React, { useEffect, useState } from 'react';
import { View, Text, BackHandler, NativeModules } from 'react-native';
import {
  StreamCall,
  StreamVideo,
  RingingCallContent,
  CallContent,
  useCalls,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { useNavigation } from '@react-navigation/native';

import useStyles from './styles';
import { CallAudioManager } from '@utils/callAudioManager';

const VideoCall = () => {
  const [loaded, setLoaded] = useState(false);
  const [accepted, setAccepted] = useState(false);

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

    const isIncoming = !call?.isCreatedByMe;
    const isVideo = true; // Video call

    // Start appropriate ringtone
    if (isIncoming) {
      CallAudioManager.startIncomingRingtone(isVideo);
    } else {
      CallAudioManager.startOutgoingRingtone(isVideo);
    }

    const unsubscribeAccepted = call.on('call.accepted', () => {
      setLoaded(true);
      // Stop ringtone and start call audio when call is accepted
      CallAudioManager.stopAllAudio();
      CallAudioManager.startCallAudio(true); // true = video call, speaker ON
      setAccepted(true);
    });

    const unsubscribeEnded = call.on('call.ended', () => {
      // Stop all audio when call ends
      CallAudioManager.stopCallAudio();
      CallAudioManager.stopAllAudio();
      navigation.goBack();
    });

    const unsubscribeRejected = call.on('call.rejected', () => {
      // Stop all audio when call is rejected
      CallAudioManager.stopCallAudio();
      CallAudioManager.stopAllAudio();
      navigation.goBack();
    });

    const unsubscribeParticipantLeft = call.on(
      'call.session_participant_left',
      () => {
        const remainingParticipants = call?.state?.participants?.length || 0;
        if (remainingParticipants <= 1) {
          // Stop all audio when last participant leaves
          CallAudioManager.stopCallAudio();
          CallAudioManager.stopAllAudio();
          navigation.goBack();
        }
      },
    );

    return () => {
      // Cleanup: stop all audio when component unmounts
      CallAudioManager.stopAllAudio();
      CallAudioManager.stopCallAudio();

      unsubscribeAccepted();
      unsubscribeEnded();
      unsubscribeRejected();
      unsubscribeParticipantLeft();
    };
  }, [call, navigation]);

  useEffect(() => {
    if (!accepted) {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Enter PiP mode when back is pressed during an ongoing call
        NativeModules.PiPModule?.enterPiP();
        return true; // Prevent default back behavior
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [accepted]);

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
          {call?.state?.callingState === 'ringing' && !accepted ? (
            <RingingCallContent />
          ) : (
            <CallContent disablePictureInPicture={false} />
          )}
        </View>
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCall;

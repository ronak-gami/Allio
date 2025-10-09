import React, { useEffect, useState } from 'react';
import {
  StreamCall,
  StreamVideo,
  useCalls,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';

import OnGoingCall from './onGoingCall';
import RingingCall from './ringingCall';
import { Text } from '@components/index';
import { useCall } from '../../../context/CallContext';
import { CallAudioManager } from '@utils/callAudioManager';

const AudioCall = ({ route }: { route?: any }) => {
  const [loaded, setLoaded] = useState(false);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [user, setUser] = useState(route?.params?.toUser);

  const { t } = useTranslation();
  const { setShowAudioCallHeader } = useCall();

  useEffect(() => {
    if (route?.params?.toUser) {
      setUser(route.params.toUser);
    }
  }, [route?.params?.toUser]);

  const navigation = useNavigation();
  const client = useStreamVideoClient();
  const calls = useCalls();
  const call = calls[0];

  // Check if call is already in progress when component mounts
  useEffect(() => {
    if (call && call.state?.callingState === 'joined' && !accepted) {
      console.log('AudioCall - Call already joined, setting accepted to true');
      setAccepted(true);
    }
  }, [call, accepted]);

  // Handle ringtone and audio management
  useEffect(() => {
    if (!call) {
      return;
    }

    const isIncoming = !call?.isCreatedByMe;
    const isVideo = false; // Audio call

    // Start appropriate ringtone
    if (isIncoming) {
      CallAudioManager.startIncomingRingtone(isVideo);
    } else {
      CallAudioManager.startOutgoingRingtone(isVideo);
    }

    const unsubscribeAccepted = call.on('call.accepted', () => {
      // Stop ringtone and start call audio when call is accepted
      CallAudioManager.stopAllAudio();
      CallAudioManager.startCallAudio(false); // false = audio call, speaker OFF
      setAccepted(true);
    });

    const unsubscribeEnded = call.on('call.ended', () => {
      // Stop all audio when call ends
      CallAudioManager.stopCallAudio();
      CallAudioManager.stopAllAudio();
      setShowAudioCallHeader(false);
      navigation.goBack();
    });

    const unsubscribeRejected = call.on('call.rejected', () => {
      // Stop all audio when call is rejected
      CallAudioManager.stopCallAudio();
      CallAudioManager.stopAllAudio();
      setShowAudioCallHeader(false);
      navigation.goBack();
    });

    const unsubscribeLeft = call.on('call.session_participant_left', () => {
      const remainingParticipants = call?.state?.participants?.length || 0;
      if (remainingParticipants <= 1) {
        // Stop all audio when last participant leaves
        CallAudioManager.stopCallAudio();
        CallAudioManager.stopAllAudio();
        setShowAudioCallHeader(false);
        navigation.goBack();
      }
    });

    return () => {
      // Cleanup: stop all audio when component unmounts
      CallAudioManager.stopAllAudio();
      CallAudioManager.stopCallAudio();

      unsubscribeAccepted();
      unsubscribeEnded();
      unsubscribeRejected();
      unsubscribeLeft();
    };
  }, [call, navigation, setShowAudioCallHeader]);

  // Handle back button during active audio call
  useEffect(() => {
    if (!accepted) {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Show audio call header and navigate back
        setShowAudioCallHeader(true);
        navigation.goBack();
        return true; // Prevent default back behavior
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [accepted, navigation, setShowAudioCallHeader]);

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
        {(() => {
          const isRinging =
            call?.state?.callingState === 'ringing' && !accepted;
          const isOngoing = accepted;

          if (isRinging) {
            return <RingingCall call={call} toUser={user} />;
          }

          if (isOngoing) {
            return <OnGoingCall call={call} toUser={user} />;
          }

          // Fallback - show ongoing if call exists and is joined
          if (call?.state?.callingState === 'joined') {
            return <OnGoingCall call={call} toUser={user} />;
          }

          return null;
        })()}
      </StreamCall>
    </StreamVideo>
  );
};

export default AudioCall;

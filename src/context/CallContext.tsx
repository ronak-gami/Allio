import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCalls } from '@stream-io/video-react-native-sdk';
import { HOME } from '@utils/constant';

interface CallContextType {
  isAudioCallActive: boolean;
  audioCallData: {
    callerName: string;
    callDuration: number;
    callId: string;
  } | null;
  showAudioCallHeader: boolean;
  setShowAudioCallHeader: (show: boolean) => void;
  navigateToAudioCall: () => void;
  endAudioCall: () => void;
  shouldPreventAutoNavigation: boolean;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

interface CallProviderProps {
  children: ReactNode;
}

export const CallProvider: React.FC<CallProviderProps> = ({ children }) => {
  const navigation = useNavigation<any>();
  const calls = useCalls();
  const call = calls[0];

  const [isAudioCallActive, setIsAudioCallActive] = useState<boolean>(false);
  const [showAudioCallHeader, setShowAudioCallHeader] =
    useState<boolean>(false);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor call state changes
  useEffect(() => {
    if (call && call.state?.custom?.call_type === 'audio') {
      const callingState = call.state?.callingState;

      // Check if call is joined/active and we haven't set it as active yet
      if (
        (callingState === 'joined' || callingState === 'ringing') &&
        !isAudioCallActive
      ) {
        console.log('CallContext - Setting call as active');
        setIsAudioCallActive(true);
        const now = Date.now();
        setCallStartTime(now);

        // Start timer for call duration
        intervalRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - now) / 1000);
          setCallDuration(elapsed);
        }, 1000);
      }
    } else if (!call && isAudioCallActive) {
      // Call ended
      setIsAudioCallActive(false);
      setShowAudioCallHeader(false);
      setCallStartTime(null);
      setCallDuration(0);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [call, isAudioCallActive]);

  // Listen to call events for more accurate state tracking
  useEffect(() => {
    if (!call) return;

    const unsubscribeAccepted = call.on('call.accepted', () => {
      if (call.state?.custom?.call_type === 'audio') {
        setIsAudioCallActive(true);
        const now = Date.now();
        setCallStartTime(now);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - now) / 1000);
          setCallDuration(elapsed);
        }, 1000);
      }
    });

    const unsubscribeEnded = call.on('call.ended', () => {
      setIsAudioCallActive(false);
      setShowAudioCallHeader(false);
      setCallStartTime(null);
      setCallDuration(0);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    });

    const unsubscribeRejected = call.on('call.rejected', () => {
      setIsAudioCallActive(false);
      setShowAudioCallHeader(false);
      setCallStartTime(null);
      setCallDuration(0);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    });

    return () => {
      unsubscribeAccepted();
      unsubscribeEnded();
      unsubscribeRejected();
    };
  }, [call]);

  // Get caller name from call participants
  const getCallerName = (): string => {
    if (!call?.state?.members) return 'Audio Call';

    const members = call.state.members;
    if (members.length > 1) {
      // Find the other participant (not the current user)
      const otherMember = members.find(
        (member: any) =>
          member.user?.name && member.user?.id !== call.currentUserId,
      );
      return otherMember?.user?.name || 'Audio Call';
    }
    return 'Audio Call';
  };

  const navigateToAudioCall = () => {
    navigation.navigate(HOME.AudioCall);
    setShowAudioCallHeader(false);
  };

  const endAudioCall = () => {
    if (call) {
      try {
        call.endCall();
      } catch (error) {
        console.error('Error ending call:', error);
        call.leave();
      }
    }
  };

  const shouldPreventAutoNavigation = showAudioCallHeader && isAudioCallActive;

  const audioCallData = isAudioCallActive
    ? {
        callerName: getCallerName(),
        callDuration,
        callId: call?.id || '',
      }
    : null;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <CallContext.Provider
      value={{
        isAudioCallActive,
        audioCallData,
        showAudioCallHeader,
        setShowAudioCallHeader,
        navigateToAudioCall,
        endAudioCall,
        shouldPreventAutoNavigation,
      }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = (): CallContextType => {
  const context = useContext(CallContext);
  if (context === undefined) {
    // Instead of throwing an error immediately, return a default state
    console.warn(
      'useCall must be used within a CallProvider - returning default state',
    );
    return {
      isAudioCallActive: false,
      audioCallData: null,
      showAudioCallHeader: false,
      setShowAudioCallHeader: () => {},
      navigateToAudioCall: () => {},
      endAudioCall: () => {},
      shouldPreventAutoNavigation: false,
    };
  }
  return context;
};

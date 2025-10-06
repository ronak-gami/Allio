import { PropsWithChildren, useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCalls } from '@stream-io/video-react-native-sdk';
import { HOME } from '@utils/constant';

const CallsProvider = ({ children }: PropsWithChildren) => {
  const calls = useCalls();
  const call = calls[0];
  const navigation = useNavigation<NavigationProp<any, any>>();

  useEffect(() => {
    if (calls.length > 0) {
      // Check custom data to determine call type
      const callType = call?.state?.custom?.call_type;

      if (callType === 'audio') {
        navigation.navigate(HOME.AudioCall);
      } else if (callType === 'video') {
        navigation.navigate(HOME.VideoCall);
      } else {
        // Default to video call if no custom data
        navigation.navigate(HOME.VideoCall);
      }
    }
  }, [calls]);

  return children;
};

export default CallsProvider;

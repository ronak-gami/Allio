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
      // For now, route audio calls based on call type, but allow 'default' type for audio calls
      if (call?.type === 'audio_room') {
        navigation.navigate(HOME.AudioCall);
      } else {
        navigation.navigate(HOME.VideoCall);
      }
    }
  }, [calls]);

  return children;
};

export default CallsProvider;

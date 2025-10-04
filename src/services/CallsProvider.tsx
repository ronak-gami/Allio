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
      navigation.navigate(HOME.VideoCall);
    }
  }, [calls]);

  return children;
};

export default CallsProvider;

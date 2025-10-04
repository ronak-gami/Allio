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
  }, [call]);

  if (!call) {
    return <Text>Not found</Text>;
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

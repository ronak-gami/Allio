import { PropsWithChildren, useEffect } from 'react';
import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { getUserData } from '@utils/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

const client = new StreamVideoClient('sgjdmtadrnsy');

const StreamClientProvider = ({ children }: PropsWithChildren) => {
  const myEmail = useSelector(
    (state: RootState) => state.auth?.userData?.email,
  );

  useEffect(() => {
    if (!myEmail) return;

    getUserData(myEmail)
      .then(data => {
        if (data?.getStreamToken && data?.getStreamUserId) {
          client.connectUser({ id: data.getStreamUserId }, data.getStreamToken);
          console.log('Stream user connected successfully');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    return () => {
      // Cleanup: disconnect user when component unmounts
      client.disconnectUser();
    };
  }, [myEmail]);

  return <StreamVideo client={client}>{children}</StreamVideo>;
};

export default StreamClientProvider;

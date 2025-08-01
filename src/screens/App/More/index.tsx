import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import useStyle from './style';
import Button from '@components/atoms/Button';
import { logout } from '@redux/slices/AuthSlice';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@types/navigations';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import { getAuth } from '@react-native-firebase/auth';
import { setStateKey, logout as reduxLogout } from '@redux/slices/AuthSlice';
type Props = BottomTabScreenProps<TabParamList, 'More'>;

const More: React.FC<Props> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const styles = useStyle();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        await firestore().collection('users').doc(currentUser.uid).update({
          fcmToken: null,
          fcmUpdatedAt: null,
        });
        await auth.signOut();
        dispatch(reduxLogout());
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>More Screens</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};
export default More;

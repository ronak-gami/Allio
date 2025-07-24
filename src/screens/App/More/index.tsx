import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import useStyle from './style';
import { logout } from 'src/redux/slices/AuthSlice';
import Button from '@components/atoms/Button';

const More: React.FC = () => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(logout());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More Screens</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </View>
  );
};
export default More;

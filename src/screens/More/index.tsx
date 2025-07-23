import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import styles from './style';
import Button from '../../components/atoms/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/AuthSlice';

const Tab4: React.FC = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch(logout());
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
export default Tab4;

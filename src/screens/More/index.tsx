import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useStyle } from '../LoginScreen/style';
import Button from '../../components/atoms/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/AuthSlice';

const Tab4: React.FC = () => {
  const styles=useStyle()
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch(logout());
  };
  return (
    <View style={styles.container}>
      <Text>More Screens</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
      />
      
    </View>
  );
};
export default Tab4;

import React from 'react';
import { View } from 'react-native';
import HeaderLogo from '@components/molecules/HeaderLogo';
import ProfileButton from '@components/molecules/ProfileButton';
import useStyle from './style';
import { useNavigation } from '@react-navigation/native';
import More from '@screens/App/More';

interface Props {
  onProfilePress: () => void;
}
const onProfilePress = () => {
  const navigation = useNavigation();
  navigation.navigate(More); // Adjust the navigation target as needed
};

const HomeHeader: React.FC<Props> = ({ onProfilePress }) => {
  const styles = useStyle();
  return (
    <View style={styles.header}>
      <HeaderLogo />
      <ProfileButton onPress={onProfilePress} />
    </View>
  );
};

export default HomeHeader;

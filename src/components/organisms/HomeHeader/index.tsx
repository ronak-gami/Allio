import React from 'react';
import { View } from 'react-native';
import HeaderLogo from '@components/molecules/HeaderLogo';
import ProfileButton from '@components/molecules/ProfileButton';
import useStyle from './style';

interface Props {
  onProfilePress: () => void;
}

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

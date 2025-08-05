import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { ICONS } from '@assets/index';
import useStyle from './style';

interface Props {
  onPress: () => void;
}

const ProfileButton: React.FC<Props> = ({ onPress }) => {
  const styles = useStyle();
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={ICONS.profile} style={styles.icon} resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default ProfileButton;

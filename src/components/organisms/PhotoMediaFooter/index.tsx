import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ICONS } from '@assets/index';
import useStyle from './style';
import { HOME } from '@utils/constant';

const Footer = () => {
  const styles = useStyle();
  const navigation = useNavigation();

  const handleCameraOpen = () => {
    navigation.navigate(HOME.Camera);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image source={ICONS.galleryIcon} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCameraOpen}>
        <Image source={ICONS.cameraButton} style={styles.cameraButton} />
      </TouchableOpacity>

      <TouchableOpacity>
        <Image source={ICONS.settings} style={styles.settingicon} />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

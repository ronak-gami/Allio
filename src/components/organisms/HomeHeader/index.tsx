import React from 'react';
import { View } from 'react-native';
import CustomHeader from '@components/atoms/CustomHeader';
import { IMAGES } from '@assets/index';
import useStyle from './style';

interface Props {
  onProfilePress: () => void;
}

const HomeHeader: React.FC<Props> = ({ onProfilePress }) => {
  const styles = useStyle();
  return (
    <View>
      <CustomHeader
        showLogo
        logoProps={{
          logo: IMAGES.Allio_Logo,
          logoStyle: styles.logoStyle,
          containerStyle: styles.logoContainer,
        }}
        showProfile
        onProfilePress={onProfilePress}
      />
    </View>
  );
};

export default HomeHeader;

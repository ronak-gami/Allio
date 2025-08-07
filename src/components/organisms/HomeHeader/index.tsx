import React from 'react';
import { View } from 'react-native';
import CustomHeader from '@components/atoms/CustomHeader';
import { ICONS, IMAGES } from '@assets/index';
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

    /*
Example usage of CustomHeader with back arrow and title:
<View>
  <CustomHeader showBackArrow={true} onBackPress={() => {}} title="Your Title" />
</View>
*/
  );
};

export default HomeHeader;

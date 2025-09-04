import React from 'react';
import { View, Image } from 'react-native';
import { Container } from '@components/index';
import MPINForm from '@components/organisms/MPINForm';
import { ICONS } from '@assets/index';
import useStyle from './style';
import useMpin from './useMpin';

const MPINSetupScreen = () => {
  const styles = useStyle();
  const { resetMpin, email } = useMpin();

  return (
    <Container showHeader={false} auth keyboardAvoiding>
      <View style={styles.iconWrapper}>
        <Image
          source={ICONS.mpinSecure}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>

      <MPINForm resetMpin={resetMpin} email={email} />
    </Container>
  );
};

export default MPINSetupScreen;

import React from 'react';
import { View, Image } from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { Container } from '@components/index';
import MPINForm from '@components/organisms/MPINForm';
import { ICONS } from '@assets/index';
import { RootState } from '@redux/store';

import { promptAppLock } from '@utils/auth';
import { HOME } from '@utils/constant';
import { checkIfMPINExists } from '@utils/helper';

import useStyle from './style';

type MPINScreenRouteParams = {
  MPIN: {
    email: string;
    resetMpin: boolean;
  };
};

const MPINSetupScreen = () => {
  const styles = useStyle();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MPINScreenRouteParams, 'MPIN'>>();
  const { resetMpin, email } = route.params || {};
  const userData = useSelector((state: RootState) => state.auth.userData);
  const isAuth = useSelector(
    (s: RootState) => s.biometric.isBiometricAuthenticated,
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     promptAppLock().then(success => {
  //       if (success) {
  //         navigation.replace(HOME.HomeTabs);
  //       }
  //     });
  //   }, [navigation, email]),
  // );

  useFocusEffect(
    React.useCallback(() => {
      const verifyMPIN = async () => {
        if (!userData?.email) return;
        const mpinExist = await checkIfMPINExists(userData.email);
        if (mpinExist && !resetMpin) {
          const success = await promptAppLock();
          if (success) {
            navigation.replace(HOME.HomeTabs);
          }
        }
      };
      verifyMPIN();
    }, [userData?.email, navigation, resetMpin]),
  );

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

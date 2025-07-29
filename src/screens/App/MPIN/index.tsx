import React, { useEffect } from 'react';
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import useStyle from './style';
import MPINForm from '@components/organisms/MPINForm';
import { ICONS } from '@assets/index';
import { promptAppLock } from '@utils/auth';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

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

  const { resetMpin,email } = route.params || {};
  const token = useSelector((s: RootState) => s.auth.token);
  const isAuth = useSelector(
    (s: RootState) => s.biometric.isBiometricAuthenticated,
  );

  useEffect(() => {
    if (token && !isAuth && !resetMpin) {
      promptAppLock().then(success => {
        if (success) {
          navigation.replace('HomeTabs');
        }
      });
    }
  }, [token, isAuth, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.iconWrapper}>
          <Image
            source={ICONS.mpinSecure}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <MPINForm resetMpin={resetMpin} email={email} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MPINSetupScreen;

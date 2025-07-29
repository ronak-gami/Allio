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
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

const MPINSetupScreen = () => {
  const styles = useStyle();
  const navigation = useNavigation();
    const token = useSelector((s: RootState) => s.auth.token);
    const isAuth = useSelector(
      (s: RootState) => s.biometric.isBiometricAuthenticated,
    );


  useEffect(() => {
    if (token && !isAuth) {
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
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
        <MPINForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MPINSetupScreen;

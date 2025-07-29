import React, { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
} from 'react-native';
import MpinForgetpasswordForm from '@components/organisms/MpinForgetpasswordForm';
import useStyle from './style';
import { ICONS } from '@assets/index';
import CustomLoader from '@components/atoms/CustomLoader';

const MpinForgetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const styles = useStyle();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconWrapper}>
          <Image
            source={ICONS.mpinSecure}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <MpinForgetpasswordForm setLoading={setLoading} />
        <CustomLoader visible={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MpinForgetPassword;

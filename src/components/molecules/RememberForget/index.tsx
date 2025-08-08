import React, { memo } from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomCheckBox from '@components/atoms/CheckBox';
import Text from '@components/atoms/Text';
import { AUTH } from '@utils/constant';
import useStyle from './style';

interface RememberForgotProps {
  remember: boolean;
  onCheckboxPress: () => void;
}

const RememberForgot: React.FC<RememberForgotProps> = ({
  remember,
  onCheckboxPress,
}) => {
  const navigation: any = useNavigation();
  const styles = useStyle();
  return (
    <View style={styles.rememberForgotView}>
      <CustomCheckBox
        label="Remember me"
        checked={remember}
        onPress={onCheckboxPress}
      />

      <Pressable
        onPress={() => navigation.push(AUTH.ForgotPassword)}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
        <Text style={styles.forgotpassText} type="semibold">
          Forgot Password?
        </Text>
      </Pressable>
    </View>
  );
};

export default memo(RememberForgot);

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation, useTheme } from '@react-navigation/native';
import CustomCheckBox from '@components/atoms/CheckBox';
import Text from '@components/atoms/Text';
import { AUTH } from '@utils/constant';

interface RememberForgotProps {
  remember: boolean;
  onCheckboxPress: () => void;
}

const RememberForgot: React.FC<RememberForgotProps> = ({
  remember,
  onCheckboxPress,
}) => {
  const navigation: any = useNavigation();
  const { colors } = useTheme();
  return (
    <View style={styles.rememberForgotView}>
      {/* ✅ Replace old Checkbox with custom one */}
      <CustomCheckBox
        label="Remember me"
        checked={remember}
        onPress={onCheckboxPress}
      />

      <Pressable
        onPress={() => navigation.navigate(AUTH.ForgotPassword)}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
        <Text style={styles.forgotpassText} type="semibold">
          Forgot Password?
        </Text>
      </Pressable>
    </View>
  );
};

export default RememberForgot;

const styles = StyleSheet.create({
  rememberForgotView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotpassText: {
    color: colors.black,
    fontSize: scale(16),
  },
});

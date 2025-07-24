import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import Text from '../../atoms/Text';
import { Checkbox } from 'react-native-paper';
import { COLORS } from '../../../utils/color';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { AUTH } from '../../../utils/constant';

interface RememberForgotProps {
  remember: boolean;
  onCheckboxPress: () => void;
}

const RememberForgot: React.FC<RememberForgotProps> = ({
  remember,
  onCheckboxPress,
}) => {
  const navigation: any = useNavigation();

  return (
    <View style={Styles.rememberForgotView}>
      <Checkbox.Item
        style={Styles.checkbox}
        position="leading"
        label="Remember me"
        labelStyle={Styles.checkboxLabel as StyleProp<TextStyle>}
        status={remember ? 'checked' : 'unchecked'}
        onPress={onCheckboxPress}
        color={COLORS.black}
      />

      <Pressable
        onPress={() => navigation.navigate(AUTH.ForgotPassword)}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
        <Text style={Styles.forgotpassText}>Forgot Password?</Text>
      </Pressable>
    </View>
  );
};

export default RememberForgot;

const Styles = StyleSheet.create({
  rememberForgotView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotpassText: {
    color: COLORS.black,
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  checkbox: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  checkboxLabel: {
    color: COLORS.black,
    fontSize: scale(16),
    fontFamily: 'WinkyRough-Regular',
  },
});

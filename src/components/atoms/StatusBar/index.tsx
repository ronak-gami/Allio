import React from 'react';
import {
  StatusBar as RNStatusBar,
  StatusBarStyle,
  SafeAreaView,
  Platform,
  ColorValue,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
type StatusBarProps = {
  backgroundColor?: ColorValue;
  barStyle?: StatusBarStyle;
  hide?: boolean;
};
const StatusBar = ({
  backgroundColor,
  barStyle,
  hide,
  ...rest
}: StatusBarProps) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={
        !hide && Platform.OS === 'ios' && { backgroundColor: colors.background }
      }>
      <RNStatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        {...rest}
      />
    </SafeAreaView>
  );
};

export default StatusBar;

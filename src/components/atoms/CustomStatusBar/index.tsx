import React, { memo, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  [key: string]: any;
};
const StatusBar = ({
  backgroundColor,
  barStyle,
  hide,
  absolute,
  ...rest
}: StatusBarProps) => {
  const { colors } = useTheme();

  const insets = useSafeAreaInsets();

  const height = useMemo(() => {
    return absolute
      ? 0
      : Platform.OS === 'ios'
      ? insets.top
      : RNStatusBar.currentHeight;
  }, [absolute, insets]);
  return (
    <SafeAreaView
      style={
        !hide &&
        Platform.OS === 'ios' && {
          backgroundColor: colors.background,
          paddingTop: height,
        }
      }>
      <RNStatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        {...rest}
      />
    </SafeAreaView>
  );
};

export default memo(StatusBar);

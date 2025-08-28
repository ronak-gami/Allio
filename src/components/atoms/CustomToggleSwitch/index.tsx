import React, { memo, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import useStyle from './style';
import { useTheme } from '@react-navigation/native';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  disabled?: boolean;
  style?: any;
}

const CustomToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,
  size = 'small',
  activeColor,
  inactiveColor,
  thumbColor,
  disabled = false,
  style,
}) => {
  const animatedValue = React.useRef(new Animated.Value(isOn ? 1 : 0)).current;
  const styles = useStyle();
  const { colors } = useTheme();

  const finalActiveColor = activeColor || colors.primary;
  const finalInactiveColor = inactiveColor || colors.gray;
  const finalThumbColor = thumbColor || colors.white;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, isOn]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          switch: [styles.switch, styles.switchSmall],
          thumb: [styles.thumb, styles.thumbSmall],
          translateX: 20,
        };
      case 'large':
        return {
          switch: [styles.switch, styles.switchLarge],
          thumb: [styles.thumb, styles.thumbLarge],
          translateX: 30,
        };
      default: // medium
        return {
          switch: [styles.switch, styles.switchMedium],
          thumb: [styles.thumb, styles.thumbMedium],
          translateX: 26,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [finalInactiveColor, finalActiveColor],
  });

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, sizeStyles.translateX],
  });

  const handlePress = () => {
    if (!disabled) {
      onToggle(!isOn);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      onPress={handlePress}
      style={[styles.container, style]}
      disabled={disabled}>
      <Animated.View
        style={[
          sizeStyles.switch,
          {
            backgroundColor: trackColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        <Animated.View
          style={[
            sizeStyles.thumb,
            {
              backgroundColor: finalThumbColor,
              transform: [{ translateX: thumbTranslateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default memo(CustomToggleSwitch);

import React from 'react';
import { Pressable, Image, StyleSheet, ViewStyle, ImageSourcePropType, AccessibilityProps } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../../../utils/color';

interface SocialButtonProps extends AccessibilityProps {
  icon: ImageSourcePropType;
  onPress: () => void;
  style?: ViewStyle;
  testID?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, onPress, style, accessibilityLabel, testID }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <Image source={icon} style={styles.icon} />
    </Pressable>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  button: {
    marginHorizontal: scale(8),
    borderRadius: scale(20),
    padding: scale(6),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pressed: {
    backgroundColor: COLORS.hoverColor,
    opacity: 0.8,
  },
  icon: {
    width: scale(32),
    height: scale(32),
    resizeMode: 'contain',
  },
});

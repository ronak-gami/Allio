import React from 'react';
import { Pressable, Image, ViewStyle, ImageSourcePropType, AccessibilityProps } from 'react-native';
import useStyle from './style';

interface SocialButtonProps extends AccessibilityProps {
  icon: ImageSourcePropType;
  onPress: () => void;
  style?: ViewStyle;
  testID?: string;
}
const styles=useStyle()
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



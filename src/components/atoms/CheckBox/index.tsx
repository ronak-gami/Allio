import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';

import { ICONS } from '@assets/index';

import Text from '../Text';
import useStyle from './style';

interface CustomCheckBoxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
  label,
  checked,
  onPress,
}) => {
  const handleImageError = (e: any) => {
    console.warn('Check icon failed to load:', e.nativeEvent?.error);
  };
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.circle, checked && styles.selectedCircle]}
        onPress={onPress}>
        {checked && (
          <Image
            source={ICONS.check}
            style={styles.checkIcon}
            resizeMode="contain"
            onError={handleImageError}
          />
        )}
      </TouchableOpacity>
      <Text style={styles.label} type="medium">
        {label}
      </Text>
    </View>
  );
};

export default CustomCheckBox;

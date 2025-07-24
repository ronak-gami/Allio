import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { ICONS } from '../../../assets';
import Text from '../Text';
import styles from './style';

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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.circle, checked && styles.selectedCircle]}>
        {checked && (
          <Image
            source={ICONS.check}
            style={styles.checkIcon}
            resizeMode="contain"
            onError={handleImageError}
          />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomCheckBox;

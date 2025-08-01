import React from 'react';
import {
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import useStyle from './style';
import { width } from '@utils/helper';
import Text from '../Text';

interface CustomIconProps {
  icon: ImageSourcePropType;
  size?: number;
  bottomLabel: string;
  [key: string]: any;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  icon,
  size = width * 0.13,
  bottomLabel,
  ...props
}) => {
  const { colors } = useTheme();
  const styles = useStyle();

  return (
    <View style={styles.EditIcon}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderColor: colors.primary,
          },
        ]}
        {...props}>
        <Image
          source={icon}
          style={{
            tintColor: colors.primary,
            width: size * 0.5,
            height: size * 0.5,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.bottomLabel}>{bottomLabel}</Text>
    </View>
  );
};

export default CustomIcon;

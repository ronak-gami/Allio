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

interface CustomIconProps {
  icon: ImageSourcePropType;
  size?: number;
  [key: string]: any;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  icon,
  size = width * 0.13,
  ...props
}) => {
  const { colors } = useTheme();
  const styles = useStyle();

  return (
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
  );
};

export default CustomIcon;

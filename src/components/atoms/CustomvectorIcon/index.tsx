import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleProp, TextStyle} from 'react-native';

type IconFamily =
  | 'AntDesign'
  | 'Ionicons'
  | 'MaterialIcons'
  | 'FontAwesome'
  | 'Feather'
  | 'Entypo'
  | 'MaterialCommunityIcons';

interface CustomVectorIconProps {
  name: string; // Format: "Ionicons:home-outline"
  size: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

const iconMap: Record<IconFamily, any> = {
  AntDesign,
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
  Entypo,
  MaterialCommunityIcons,
};

const CustomVectorIcon: React.FC<CustomVectorIconProps> = ({
  name,
  size,
  color = '#000',
  style,
}) => {
  const [family, iconName] = name.split(':') as [IconFamily, string];

  const IconComponent = iconMap[family];

  if (!IconComponent) {
    console.warn(`Icon family "${family}" not supported`);
    return null;
  }

  return (
    <IconComponent name={iconName} size={size} color={color} style={style} />
  );
};

export default CustomVectorIcon;

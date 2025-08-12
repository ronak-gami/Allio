import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import useStyle from './style';

interface BottomSheetContentProps {
  image: any; // image source (local or remote)
  description: string;
  buttonTitle: string;
  onButtonPress?: () => void;
}

const Customlogout: React.FC<BottomSheetContentProps> = ({
  image,
  description,
  buttonTitle,
  onButtonPress,
}) => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      {/* <Text type="SEMIBOLD" style={styles.description} lable="description" /> */}
      <Text type="SEMIBOLD" style={styles.description}>
        {description}
      </Text>

      {/* Button */}
      {buttonTitle && <Button title={buttonTitle} onPress={onButtonPress} />}
    </View>
  );
};

export default memo(Customlogout);

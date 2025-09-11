import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import Text from '@components/atoms/Text';
import useStyle from './styles';

const AccelometerCard = ({ item, handlePress }) => {
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{item?.name}</Text>
      <Text style={styles.text}>{item?.time}</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.text}>View</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccelometerCard;

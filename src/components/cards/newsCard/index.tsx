import { View, Image, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';

import Text from '@components/atoms/Text';
import { ICONS, IMAGES } from '@assets/index';

import useStyle from './styles';

const NewsCard = ({ item, handleDelete, handleEdit }) => {
  const styles = useStyle();

  return (
    <View style={styles.gridItem}>
      <View style={{ flex: 1 }}>
        <Text type="BOLD">{item?.name}</Text>
        <Text numberOfLines={2}>{item?.description}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={handleDelete}>
        <Image source={IMAGES.delete} style={styles.delete} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} onPress={handleEdit}>
        <Image source={ICONS.Edit} style={styles.edit} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(NewsCard);

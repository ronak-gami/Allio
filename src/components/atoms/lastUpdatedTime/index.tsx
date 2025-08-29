import { Image, View } from 'react-native';
import React, { memo } from 'react';

import Text from '../Text';

import { formatLastUpdated } from '@utils/helper';
import useStyle from './styles';
import { ICONS } from '@assets/index';

interface LastUpdatedTimeProps {
  time: string | null;
}

const LastUpdatedTime = ({ time }: LastUpdatedTimeProps) => {
  const styles = useStyle();

  return (
    <View style={styles.content}>
      <Text label={formatLastUpdated(time)} />
      <Image source={ICONS.Refresh} style={styles.image} />
    </View>
  );
};

export default memo(LastUpdatedTime);

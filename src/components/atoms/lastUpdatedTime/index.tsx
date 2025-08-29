import { Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import Text from '../Text';
import { ICONS } from '@assets/index';

import { formatLastUpdated } from '@utils/helper';
import useStyle from './styles';

interface LastUpdatedTimeProps {
  time: string | null;
}

const LastUpdatedTime = ({ time }: LastUpdatedTimeProps) => {
  const styles = useStyle();

  const [formatted, setFormatted] = useState<string>(
    time ? formatLastUpdated(time) : '',
  );

  useEffect(() => {
    if (!time) return;
    const update = () => {
      setFormatted(formatLastUpdated(time));
    };
    update();
    const intervalId = setInterval(update, 60000);

    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <View style={styles.content}>
      <Text label={formatted} />
      <Image source={ICONS.Refresh} style={styles.image} />
    </View>
  );
};

export default LastUpdatedTime;

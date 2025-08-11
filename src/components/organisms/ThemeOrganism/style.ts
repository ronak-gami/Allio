import { StyleSheet } from 'react-native';

import { height, width } from '@utils/helper';
import { scale } from 'react-native-size-matters';
import { COLORS } from '@utils/color';

const useStyle = () => {
  return StyleSheet.create({
    buttonnew: {
      backgroundColor: COLORS.primary,

      marginVertical: scale(6),
    },
  });
};

export default useStyle;

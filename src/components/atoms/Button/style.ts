import { FONTS, width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    button: {
      borderRadius: 10,
      paddingHorizontal: width * 0.05,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: width * 0.04,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontSize: scale(16),
    },
    icon: {
      marginHorizontal: scale(8),
    },
  });
};

export default useStyle;

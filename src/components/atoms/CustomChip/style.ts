import { width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    chip: {
      borderRadius: scale(50),
      paddingVertical: width * 0.025,
      paddingHorizontal: width * 0.05,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: scale(14),
    },
  });
};

export default useStyle;

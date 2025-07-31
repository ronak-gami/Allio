import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    chip: {
      borderRadius: scale(50),
      paddingVertical: scale(8),
      paddingHorizontal: scale(16),
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: scale(14),
    },
  });
};

export default useStyle;

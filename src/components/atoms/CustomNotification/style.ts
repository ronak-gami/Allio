import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

import { width } from '@utils/helper';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: scale(10),
      left: scale(15),
      marginRight: scale(5),
      width: width * 0.92,
      paddingVertical: scale(20),
      paddingHorizontal: scale(20),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 9999,
      borderRadius: scale(10),
    },
    messageText: {
      color: colors.text,
      fontSize: scale(15),
      flexShrink: 1,
    },
    closeButton: {
      padding: 5,
    },
    closeIcon: {
      width: scale(10),
      height: scale(10),
      tintColor: colors.text,
    },
  });
};

export default useStyle;

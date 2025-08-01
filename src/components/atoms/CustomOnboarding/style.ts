import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

import { height, width } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.lightyellow,
      justifyContent: 'center',
      paddingHorizontal: scale(20),
    },
    image: {
      width: width * 0.8,
      height: height * 0.5,
      resizeMode: 'contain',
      alignItems: 'center',
      borderRadius: scale(88),
    },
    title: {
      fontSize: scale(18),
      textAlign: 'left',
      marginTop: scale(16),
      color: colors.black,
    },
    description: {
      fontSize: scale(18),
      textAlign: 'left',
      width: '50%',
      marginTop: scale(8),
      color: colors.black,
    },
  });
};

export default useStyle;

import { COLORS } from '@utils/color';
import { height, width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.lightyellow,
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
      fontWeight: 'bold',
      textAlign: 'left',
      marginTop: scale(16),
      color: COLORS.black,
    },
    description: {
      fontSize: scale(18),
      textAlign: 'left',
      width: '50%',
      marginTop: scale(8),
      color: COLORS.black,
    },
  });
};

export default useStyle;

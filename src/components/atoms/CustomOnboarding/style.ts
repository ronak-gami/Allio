import { useTheme } from '@react-navigation/native';
import { height, width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.lightyellow,
      alignItems: 'center',
    },
    image: {
      width: width * 0.8,
      height: height * 0.5,
      resizeMode: 'contain',
    },
    title: {
      fontSize: scale(24),
      color: colors.black,
      textAlign: 'center',
    },
    description: {
      fontSize: scale(18),
      color: colors.black,
      width: width * 0.8,
      textAlign: 'center',
    },
  });
};

export default useStyle;

import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { height, width } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    card: {
      margin: height * 0.004,
      aspectRatio: 1,
      borderRadius: height * 0.01,
      overflow: 'hidden',
      height: height * 0.2,
      width: width / 2 - 25,
      backgroundColor: colors.background,
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });
};

export default useStyle;

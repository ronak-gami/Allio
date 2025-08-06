import { useTheme } from '@react-navigation/native';
import { width } from '@utils/helper';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    gridItem: {
      width: (width - width * 0.12) / 2,
      height: (width - width * 0.12) / 2,
      backgroundColor: 'red',
      borderRadius: width * 0.03,
    },
    VideoPlayIcon: {
      position: 'absolute',
      width: width * 0.1,
      height: width * 0.1,
      top: '50%',
      left: '50%',
      transform: [{ translateX: -width * 0.05 }, { translateY: -width * 0.05 }],
      tintColor: colors.background,
    },
  });
};

export default useStyle;

import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    videoModalContent: {
      width: '100%',
      alignItems: 'center',
    },
    modalVideoPlayer: {
      width: '100%',
      minHeight: height * 0.5,
    },
    iconsView: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
    },
    icon: {
      tintColor: colors.primary,
      width: width * 0.065,
      height: width * 0.065,
    },
  });
};

export default useStyle;

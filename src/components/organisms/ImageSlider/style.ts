import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { height, width } from '@utils/helper';

const IMAGE_WIDTH = width * 0.7;
const IMAGE_MARGIN = scale(10);

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(10),
      backgroundColor: colors.white,
      height: height * 0.22,
      width: width * 0.99,
      marginVertical: scale(15),
    },
    contentContainer: {
      paddingHorizontal: (width - IMAGE_WIDTH) / 3 - IMAGE_MARGIN * 0.5,
    },
    image: {
      width: IMAGE_WIDTH,
      height: height * 0.2,
      borderRadius: scale(16),
      marginHorizontal: IMAGE_MARGIN,
    },
    arrowLeft: {
      position: 'absolute',
      left: scale(8),
      zIndex: 2,
      padding: scale(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowRight: {
      position: 'absolute',
      right: scale(8),
      zIndex: 2,
      padding: scale(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowIcon: {
      width: scale(20),
      height: scale(20),
      tintColor: colors.black,
    },
  });
};
export default useStyle;

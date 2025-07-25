import { COLORS } from '@utils/color';
import { height, width } from '@utils/helper';
import { scale } from 'react-native-size-matters';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    loaderContainer: {
      backgroundColor: COLORS.white,
      borderRadius: scale(8),
      padding: scale(10),
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 100,
      minHeight: 100,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loadingText: {
      marginTop: scale(10),
      fontSize: scale(16),
      fontWeight: '500',
      textAlign: 'center',
    },
  });
};

export default useStyle;

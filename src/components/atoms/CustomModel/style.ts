import { width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: width * 0.03,
    },
    card: {
      width: '100%',
      borderRadius: scale(10),
      padding: width * 0.03,
      alignItems: 'center',
      position: 'relative',
    },
    title: {
      fontSize: scale(20),
      marginBottom: width * 0.03,
    },
    description: {
      fontSize: scale(14),
      marginBottom: width * 0.03,
      textAlign: 'center',
    },
    closeIconContainer: {
      position: 'absolute',
      top: width * 0.025,
      right: width * 0.025,
      padding: width * 0.02,
    },
    closeIcon: {
      width: width * 0.05,
      height: width * 0.05,
    },
  });
};

export default useStyle;

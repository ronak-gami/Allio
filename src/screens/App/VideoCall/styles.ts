import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
    },
    buttonGroup: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingVertical: scale(2),
      borderTopLeftRadius: scale(2),
      borderTopRightRadius: scale(2),
    },
  });
};

export default useStyles;

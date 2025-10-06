import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { responsive } from '@utils';

const useStyles = () => {
  const { colors } = useTheme();
  const { height, width } = responsive;
  return StyleSheet.create({
    container: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
    },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: width(100),
    },
    acceptButton: {
      height: height(7),
      width: height(7),
      borderRadius: height(7),
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: height(1),
      backgroundColor: colors.primary,
    },
  });
};

export default useStyles;

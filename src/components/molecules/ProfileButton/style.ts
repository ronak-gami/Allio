import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    button: {
      borderRadius: scale(18),
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: scale(28),
      height: scale(28),
    },
  });
};
export default useStyle;

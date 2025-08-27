import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  return StyleSheet.create({
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: scale(75),
      height: scale(75),
      borderRadius: scale(10),
    },
  });
};
export default useStyle;

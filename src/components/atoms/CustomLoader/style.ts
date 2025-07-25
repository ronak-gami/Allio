import { useTheme } from '@react-navigation/native';
import { height, width } from '@utils/helper';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();
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
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 100,
      minHeight: 100,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loadingText: {
      marginTop: 15,
      fontSize: 16,
      textAlign: 'center',
    },
  });
};
export default useStyle;

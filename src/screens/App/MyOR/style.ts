import { useTheme } from '@react-navigation/native';
import { height, width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: height * 0.02,
      backgroundColor: colors.background,
    },
    scrollcontainer: {
      alignItems: 'center',
    },
    orText: {
      fontSize: scale(14),
      color: colors.text,
    },
    orContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: height * 0.02,
      marginVertical: height * 0.05,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.primary,
      marginHorizontal: 10,
    },
    buttonGroup: {
      width: '100%',
      gap: height * 0.02,
    },
    qrImage: {
      width: height * 0.2,
      height: height * 0.2,
      borderRadius: 10,
      backgroundColor: colors.white,
    },
    cameraContainer: {
      width: height * 0.3 - 90,
      height: height * 0.3 - 90,
      backgroundColor: colors.text,
      borderRadius: height * 0.02,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    camera: {
      width: width * 0.5 - 20,
      height: height * 0.2,
      borderRadius: height * 0.01,
      overflow: 'hidden',
      position: 'relative',
    },
  });
};

export default useStyle;

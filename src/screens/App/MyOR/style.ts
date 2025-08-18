import { useTheme } from '@react-navigation/native';
import { height, width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    textColor: {
      color: colors.text,
    },
    container: {
      padding: height * 0.02,
      backgroundColor: colors.background,
      alignItems: 'center',
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
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    cameraContainer: {
      width: height * 0.35 - 90,
      height: height * 0.35 - 90,
      alignItems: 'center',
      marginVertical: height * 0.05,
      justifyContent: 'center',
    },
    camera: {
      width: height * 0.35 - 20,
      height: height * 0.35,
      borderRadius: height * 0.01,
      overflow: 'hidden',
      position: 'relative',
    },
  });
};

export default useStyle;

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
      backgroundColor: colors.white,
    },
    scrollcontainer: {
      alignItems: 'center',
    },
    title: {
      fontSize: scale(20),
    },

    inputContainer: {
      gap: height * 0.025,
      width: '100%',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.grey,
      borderRadius: 8,
      paddingHorizontal: height * 0.025,
      paddingVertical: height * 0.025,
      marginBottom: height * 0.025,
    },

    orText: {
      fontSize: scale(14),
    },

    buttonText: {
      color: colors.white,
      fontWeight: 'bold',
      fontSize: scale(16),
    },

    titleRow: {
      alignItems: 'center',
      paddingHorizontal: height * 0.02,
      marginBottom: height * 0.02,
      margin: 10,
    },

    openQrButton: {
      paddingVertical: 6,
      alignItems: 'flex-end',
      paddingHorizontal: height * 0.02,
      borderRadius: 6,
    },

    flashIconButton: {
      alignSelf: 'center',
      marginVertical: 5,
      borderRadius: 10,
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

    qrContainer: {
      alignItems: 'center',
      marginVertical: 20,
      borderWidth: 1,
    },
    qrBox: {
      padding: height * 0.02,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    buttonGroup: {
      width: '100%',
      gap: height * 0.02,
    },
    qrImage: {
      width: height * 0.2,
      height: height * 0.2,
      borderRadius: 10,
      backgroundColor: 'white',
    },
    cameraContainer: {
      width: height * 0.3 - 90,
      height: height * 0.3 - 90,
      backgroundColor: colors.background,
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

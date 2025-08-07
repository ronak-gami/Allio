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
    title: {
      fontSize: scale(20),
      color: colors.text,
    },

    inputContainer: {
      gap: height * 0.02,
      width: '100%',
    },
    input: {
      width: '100%',
    },

    orText: {
      fontSize: scale(14),
      color: colors.text,
    },

    buttonText: {
      color: colors.white,
      fontWeight: 'bold',
      fontSize: scale(16),
    },
    flashIcon: {
      width: height * 0.05,
      height: height * 0.05,
      resizeMode: 'contain',
      tintColor: colors.black,
    },
    flashIconContainer: {
      alignSelf: 'center',
    },

    borderFrame: {
      width: height * 0.2,
      height: height * 0.3,
      borderWidth: 3,
      borderColor: colors.primary,
      borderRadius: height * 0.02,
    },

    cameraContainer: {
      width: width * 0.7 - 10,
      height: height * 0.4 - 95,
      padding: height * 0.02,
      backgroundColor: colors.background,
      borderRadius: height * 0.02,
      alignItems: 'center',
      justifyContent: 'center',
    },
    camera: {
      width: width * 0.6 - 20,
      height: height * 0.3 - 50,
      borderRadius: height * 0.01,
      overflow: 'hidden',
      position: 'relative',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'space-between',
    },
    corner: {
      position: 'absolute',
      width: height * 0.04,
      height: height * 0.04,
      borderColor: colors.primary,
      borderWidth: 6,
    },
    topLeft: {
      top: height * 0.01,
      left: height * 0.01,
      borderTopLeftRadius: height * 0.01,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderTopRightRadius: height * 0.01,
    },
    topRight: {
      top: height * 0.01,
      right: height * 0.01,
      borderLeftWidth: 0,
      borderBottomWidth: 0,
      borderTopRightRadius: height * 0.01,
    },
    bottomLeft: {
      bottom: height * 0.01,
      left: height * 0.01,
      borderRightWidth: 0,
      borderTopWidth: 0,
      borderBottomLeftRadius: height * 0.01,
    },
    bottomRight: {
      bottom: height * 0.01,
      right: height * 0.01,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderBottomRightRadius: height * 0.01,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: height * 0.025,
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
      marginVertical: height * 0.05,
      paddingHorizontal: height * 0.016,
    },

    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.primary,
      marginHorizontal: height * 0.01,
    },
  });
};

export default useStyle;

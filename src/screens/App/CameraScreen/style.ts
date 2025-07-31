
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      ...StyleSheet.absoluteFillObject,
    },
    topBar: {
      position: 'absolute',
      top: scale(30),
      left: scale(20),
      zIndex: 10,
    },
    bottomBar: {
      position: 'absolute',
      bottom: scale(60),
      width: '100%',
      alignItems: 'center',
    },
    captureButton: {
      width: scale(70),
      height: scale(70),
      borderRadius: scale(35),
      backgroundColor:colors.gray,
      borderWidth: scale(4),
      borderColor: colors.white,
    },
    icon: {
      width: scale(30),
      height: scale(30),
      tintColor: colors.white,
    },
    loadingScreen: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default useStyle;

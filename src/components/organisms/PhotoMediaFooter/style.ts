import { useTheme } from '@react-navigation/native';
import { height } from '@utils/helper';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '10%',
      backgroundColor: colors.background,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    icon: {
      width: height * 0.05,
      height: height * 0.04,
    },
    cameraButton: {
      width: height * 0.066,
      height: height * 0.066,
    },
    settingicon: {
      width: height * 0.025,
      height: height * 0.025,
      resizeMode: 'contain',
    },
  });
};
export default useStyle;

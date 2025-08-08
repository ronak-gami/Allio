import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { width, height } from '@utils/helper';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    headerContainer: {
      position: 'relative',
      height: height * 0.06,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    leftButton: {
      position: 'absolute',
      left: width * 0.04,
      top: '50%',
      transform: [{ translateY: -scale(18) }],
      zIndex: 1,
      padding: scale(8),
      backgroundColor: 'transparent',
    },
    leftLogo: {
      position: 'absolute',
      left: width * 0.04,
      top: '50%',
      transform: [{ translateY: -scale(22) }],
      zIndex: 1,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: width * 0.15,
    },
    rightButton: {
      position: 'absolute',
      right: width * 0.04,
      top: '50%',
      transform: [{ translateY: -scale(15) }],
      zIndex: 1,
    },
    backIcon: {
      width: scale(18),
      height: scale(18),
      tintColor: colors.black,
    },
    title: {
      fontSize: scale(22),
      color: colors.black,
      textAlign: 'center',
    },
    logoStyle: {
      width: scale(50),
      height: scale(50),
    },
  });
};

export default useStyle;

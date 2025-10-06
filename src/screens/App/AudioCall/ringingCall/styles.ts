import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { height, width } from '@utils/helper';

const useStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flexGrow: 1,
      paddingTop: height * 0.2,
    },
    image: {
      height: height * 0.2,
      width: height * 0.2,
      borderRadius: height * 0.1,
      marginBottom: height * 0.02,
    },
    title: {
      fontSize: scale(18),
      marginBottom: height * 0.02,
    },
    buttons: {
      bottom: height * 0.05,
      right: 0,
      left: 0,
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: height * 0.02,
    },
    acceptButton: {
      height: height * 0.07,
      width: height * 0.07,
      borderRadius: height * 0.035,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: height * 0.01,
    },
    rejectButton: {
      height: height * 0.07,
      width: height * 0.07,
      borderRadius: height * 0.035,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: height * 0.01,
    },
    buttonIcon: {
      width: scale(24),
      height: scale(24),
    },
  });
};

export default useStyles;

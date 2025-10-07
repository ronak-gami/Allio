import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { height, width } from '@utils/helper';
import { useTheme } from '@react-navigation/native';

const useStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flexGrow: 1,
      marginTop: height * 0.2,
    },
    image: {
      height: height * 0.25,
      width: height * 0.25,
      borderRadius: height * 0.125,
      marginBottom: height * 0.03,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    title: {
      fontSize: scale(24),
      fontWeight: '700',
      marginBottom: height * 0.01,
      textAlign: 'center',
      paddingHorizontal: scale(20),
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
    muteButton: {
      height: height * 0.07,
      width: height * 0.07,
      borderRadius: height * 0.035,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: height * 0.01,
    },
    hangupButton: {
      height: height * 0.07,
      width: height * 0.07,
      borderRadius: height * 0.035,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: height * 0.01,
    },
    buttonIcon: {
      width: scale(50),
      height: scale(50),
    },
    buttonIconMute: {
      width: scale(25),
      height: scale(25),
      tintColor: colors.background,
    },
    placeholderImage: {
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: scale(28),
      fontWeight: '600',
      color: colors.background,
    },
    callStatus: {
      fontSize: scale(16),
      fontWeight: '500',
      marginBottom: height * 0.01,
      opacity: 0.8,
    },
    duration: {
      fontSize: scale(20),
      fontWeight: '600',
      marginBottom: height * 0.03,
    },
  });
};

export default useStyles;

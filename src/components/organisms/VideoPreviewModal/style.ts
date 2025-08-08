import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { height, width } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    card: {
      aspectRatio: 1,
      borderRadius: scale(10),
      overflow: 'hidden',
      height: height * 0.2,
      width: width / 2 - scale(36),
      backgroundColor: colors.background,
    },

    modalBackground: {
      flex: 1,
      backgroundColor: colors.text,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: scale(10),
      overflow: 'hidden',
      alignItems: 'center',
      padding: scale(16),
      width: width * 0.9,
    },
    modalImage: {
      width: '100%',
      height: height * 0.4,
      borderRadius: scale(10),
      resizeMode: 'contain',
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: height * 0.02,
    },

    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    iconImage: {
      width: height * 0.03,
      height: height * 0.03,
      resizeMode: 'contain',
      tintColor: colors.primary,
    },
    profileImage: {
      height: height * 0.065,
      width: height * 0.065,
      borderRadius: height * 0.0325,
      marginRight: height * 0.015,
    },
    placeholder: {
      height: height * 0.065,
      width: height * 0.065,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: scale(18),
      color: colors.text,
    },
    placeholderText1: {
      fontSize: scale(14),
      color: colors.background,
    },

    selectText: {
      marginBottom: height * 0.002,
    },
    friendsList: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: height * 0.02,
      marginLeft: height * 0.01,
    },
    sendButton: {
      marginBottom: height * 0.02,
    },
    videoModalContent: {
      width: '100%',
      alignItems: 'center',
    },
    modalVideoPlayer: {
      width: '100%',
      minHeight: height * 0.3,
    },
    iconsView: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
    },
    icon: {
      tintColor: colors.primary,
      width: width * 0.065,
      height: width * 0.065,
    },
  });
};

export default useStyle;

import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { height } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      paddingVertical: height * 0.015,
      borderBottomWidth: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      height: height * 0.065,
      width: height * 0.065,
      resizeMode: 'contain',
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
      marginRight: height * 0.015,
    },
    placeholderText: {
      fontSize: scale(18),
      color: colors.text,
    },
    userInfo: {
      flex: 1,
    },
    name: {
      fontSize: scale(16),
      color: colors.text,
    },
    actionRow: {
      flexDirection: 'row',
    },
    iconimage: {
      height: height * 0.035,
      width: height * 0.035,
      resizeMode: 'contain',
    },
    iconimage1: {
      height: height * 0.035,
      width: height * 0.035,
      resizeMode: 'contain',
      tintColor: colors.primary,
    },
    send: {
      borderRadius: height * 0.05,
      padding: 10,
    },
    pendingChip: {
      backgroundColor: colors.primary,
      borderRadius: height * 0.02,
      paddingVertical: 4,
      paddingHorizontal: height * 0.01,
      justifyContent: 'center',
      alignItems: 'center',
    },

    pendingText: {
      fontSize: scale(10),
      color: colors.text,
    },
    acceptedChip: {
      paddingHorizontal: height * 0.01,
      paddingVertical: 5,
      borderRadius: height * 0.02,
      backgroundColor: colors.accepted,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: height * 0.01,
    },

    acceptedText: {
      color: colors.text,
      fontSize: scale(10),
    },
    email: {
      color: colors.text,
      fontSize: scale(9),
    },
  });
};

export default useStyle;

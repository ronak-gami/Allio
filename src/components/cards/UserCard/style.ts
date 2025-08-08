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
      // backgroundColor: colors.primary,
      borderRadius: 50,
      padding: 10,
    },
    pendingChip: {
      backgroundColor: '#E0E0E0',
      borderRadius: 20,
      paddingVertical: 4,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },

    pendingText: {
      fontSize: 12,
      color: '#333',
      fontWeight: '500',
    },
    acceptedChip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      backgroundColor: '#C8E6C9', 
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },

    acceptedText: {
      color: '#2E7D32', 
      fontWeight: 'bold',
      fontSize: 10,
    },
    email: {
      fontSize: 10,
    },
  });
};

export default useStyle;

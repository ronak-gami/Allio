import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { height } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    content: {
      justifyContent: 'center',
      padding: height * 0.02,
    },
    avatarContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: height * 0.03,
    },
    avatarWrapper: {
      width: height * 0.15,
      height: height * 0.15,
      position: 'relative',
      borderRadius: 100,
    },
    avatar: {
      width: height * 0.15,
      height: height * 0.15,
      borderRadius: 100,
    },
    editBadge: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      backgroundColor: colors.white,
      borderRadius: height * 0.02,
      padding: 6,
      elevation: 3,
    },

    editIcon: {
      width: height * 0.02,
      height: height * 0.02,
      tintColor: colors.primary,
    },

    gap: {
      gap: height * 0.02,
    },
  });
};

export default useStyle;

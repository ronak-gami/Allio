import { useTheme } from '@react-navigation/native';
import { height, width } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderBottomWidth: 1,
      borderBottomColor: colors.text,
    },
    tabButton: {
      alignItems: 'center',
      width: width / 3,
      padding: 15,
    },
    activeTabButton: {
      borderBottomWidth: 4,
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: scale(16),
      color: colors.text,
    },
    activeTabText: {
      color: colors.primary,
    },
    form: {
      paddingHorizontal: width * 0.05,
      marginTop: width * 0.05,
    },
    button: {
      marginTop: scale(8),
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
  });
};

export default useStyle;

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
      paddingHorizontal: scale(12),
    },
    contentContainer: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
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

    contentContainer: {
      padding: 20,
      marginBottom: height * 0.12,
      height: height * 0.8,
    },
    contentText: {
      fontSize: 18,
      color: '#333',
    },
    emptyStateContainer: {
      alignItems: 'center',
      paddingVertical: height * 0.08,
    },
    noGalleryIcon: {
      width: width * 0.35,
      height: width * 0.35,
      marginBottom: height * 0.02,
    },

    emptyStateTitle: {
      fontSize: scale(24),
      marginBottom: height * 0.01,
      color: colors.primary,
    },
    emptyStateSubtitle: {
      fontSize: scale(16),
      color: colors.text,
      textAlign: 'center',
      lineHeight: scale(24),
      paddingHorizontal: width * 0.08,
    },
  });
};

export default useStyle;

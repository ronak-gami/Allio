import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: width * 0.04,
    },
    contentNone: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: width * 0.04,
    },

    // Header Styles
    headerView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: height * 0.02,
      paddingHorizontal: width * 0.01,
    },
    headerButton: {
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.005,
      borderRadius: width * 0.05,
      minWidth: width * 0.2,
    },
    headerText: {
      fontSize: scale(16),
    },

    // Video Player Styles
    videoPlayer: {
      width: '100%',
      height: height * 0.55,
      borderRadius: width * 0.03,
      backgroundColor: colors.text,
    },

    // Video Info Card Styles
    videoInfoCard: {
      backgroundColor: colors.text,
      marginTop: height * 0.02,
      padding: width * 0.04,
      borderRadius: width * 0.03,
      borderWidth: 1,
    },
    videoInfoHeader: {
      marginBottom: height * 0.015,
    },
    videoTitle: {
      color: colors.background,
      fontSize: scale(18),
    },
    videoStatsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statLabel: {
      fontSize: scale(14),
      marginBottom: height * 0.005,
      color: colors.background,
    },
    statValue: {
      fontSize: scale(16),
      color: colors.background,
    },
    statDivider: {
      width: 1,
      height: height * 0.05,
      marginHorizontal: width * 0.04,
      backgroundColor: colors.primary,
    },

    // Empty State Styles
    emptyStateContainer: {
      alignItems: 'center',
      paddingVertical: height * 0.08,
    },
    NoVideoIcon: {
      width: width * 0.22,
      height: width * 0.22,
      marginBottom: height * 0.02,
      tintColor: colors.primary,
    },
    emptyStateTitle: {
      fontSize: scale(24),
      marginBottom: height * 0.01,
      color: colors.text,
    },
    emptyStateSubtitle: {
      fontSize: scale(16),
      textAlign: 'center',
      lineHeight: scale(24),
      paddingHorizontal: width * 0.08,
    },
    actionButtonContainer: {
      padding: width * 0.04,
      gap: height * 0.015,
    },
  });
};

export default useStyle;

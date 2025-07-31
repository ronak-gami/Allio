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
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
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
    modalContent: {
      maxHeight: height * 0.5,
    },
    modalVideoTitle: {
      color: colors.primary,
      fontSize: scale(18),
      textAlign: 'center',
    },
    modalStatCard: {
      paddingHorizontal: width * 0.03,
      paddingVertical: width * 0.005,
      borderRadius: width * 0.02,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalStatLabel: {
      fontSize: scale(14),
      color: colors.background,
    },
    modalStatValue: {
      color: colors.background,
      fontSize: scale(14),
      flex: 1,
      textAlign: 'right',
    },
    compressionPreview: {
      paddingVertical: width * 0.03,
      alignItems: 'center',
    },
    compressionTitle: {
      color: colors.primary,
      fontSize: scale(16),
    },
    compressionText: {
      color: colors.background,
      fontSize: scale(14),
      lineHeight: scale(20),
    },
    modalErrorState: {
      padding: width * 0.05,
      borderRadius: width * 0.03,
      alignItems: 'center',
      marginBottom: height * 0.02,
    },
    modalErrorText: {
      color: colors.background,
      fontSize: scale(16),
      marginBottom: height * 0.01,
    },
    modalErrorSubtext: {
      color: colors.background,
      fontSize: scale(14),
      textAlign: 'center',
      lineHeight: scale(20),
    },
    modalActions: {
      flexDirection: 'row',
      gap: width * 0.03,
    },
    successIconContainer: {
      alignItems: 'center',
    },
    successIcon: {
      color: colors.primary,
      width: width * 0.22,
      height: width * 0.22,
      textAlign: 'center',
    },
    successMessage: {
      padding: 16,
    },
    successText: {
      fontSize: scale(14),
      color: colors.primary,
      textAlign: 'center',
    },
  });
};

export default useStyle;

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
      height: height * 0.4,
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

    // Edit Actions Styles
    editIconView: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: width * 0.04,
      margin: width * 0.04,
      borderRadius: width * 0.03,
    },
    editAction: {
      flex: 1,
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.02,
      borderRadius: width * 0.02,
      minHeight: height * 0.06,
    },
    editActionText: {
      fontSize: scale(12),
      marginTop: height * 0.005,
    },

    // Action Buttons Styles
    actionButtonContainer: {
      padding: width * 0.04,
      gap: height * 0.015,
    },
    primaryActionText: {
      fontSize: scale(18),
    },
    secondaryActionText: {
      fontSize: scale(18),
    },

    // Modal Styles
    modalContent: {
      maxHeight: height * 0.5,
    },
    modalInfoHeader: {
      marginBottom: height * 0.02,
      alignItems: 'center',
    },
    modalVideoTitle: {
      color: colors.primary,
      fontSize: scale(18),
      textAlign: 'center',
      marginBottom: width * 0.01,
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
    modalCancelButton: {
      flex: 1,
      paddingVertical: height * 0.005,
      paddingHorizontal: width * 0.06,
      borderRadius: width * 0.02,
    },
    modalCancelText: {
      fontSize: scale(16),
    },
    modalConfirmButton: {
      flex: 2,
      paddingVertical: height * 0.005,
      paddingHorizontal: width * 0.06,
      borderRadius: width * 0.02,
    },
    modalConfirmText: {
      fontSize: scale(16),
    },

    // Legacy styles (keep for compatibility)
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: width * 0.03,
      padding: width * 0.04,
    },
    placeholderText: {
      color: colors.text,
      fontSize: scale(24),
    },
    videoInfoText: {
      fontSize: scale(14),
      textAlign: 'center',
      lineHeight: scale(20),
    },
  });
};

export default useStyle;

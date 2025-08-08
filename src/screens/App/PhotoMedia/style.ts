import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

import { width, height } from '@utils/helper';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    scrollcontainer: {
      flexGrow: 1,
    },
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

    videoPlayer: {
      width: '100%',
      height: height * 0.4,
      borderRadius: width * 0.03,
      backgroundColor: colors.text,
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

    emptyStateContainer: {
      alignItems: 'center',
      paddingVertical: height * 0.08,
    },
    noGalleryIcon: {
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
      paddingRight: height * 0.02,
      paddingBottom: height * 0.02,
      paddingLeft: height * 0.02,
      gap: height * 0.015,
    },
    primaryActionText: {
      fontSize: scale(18),
    },
    secondaryActionText: {
      fontSize: scale(18),
    },

    modalContent: {
      maxHeight: height * 0.5,
    },
    modalInfoHeader: {
      marginBottom: height * 0.02,
      alignItems: 'center',
    },

    modalStatCard: {
      paddingHorizontal: width * 0.03,
      paddingVertical: width * 0.005,
      borderRadius: width * 0.02,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    imageWrapper: {
      width: width * 0.9,
      height: height * 0.55,
      backgroundColor: colors.text,
      borderRadius: width * 0.03,
    },

    image: {
      width: width * 0.9,
      height: height * 0.55,
      borderRadius: width * 0.02,
    },

    videoInfoCard: {
      backgroundColor: colors.text,
      marginTop: height * 0.02,
      padding: width * 0.04,
      borderRadius: width * 0.03,
      borderWidth: 1,
      elevation: 2,
      shadowColor: colors.text,
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
  });
};

export default useStyle;

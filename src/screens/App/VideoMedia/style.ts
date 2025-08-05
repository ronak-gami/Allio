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

    // Main Grid Container
    mainContainer: {
      flex: 1,
    },

    // Video Grid Styles
    gridContainer: {
      flex: 1,
      padding: width * 0.04,
    },
    gridContent: {
      flexGrow: 1,
    },
    gridRow: {
      justifyContent: 'space-between',
      marginBottom: height * 0.02,
    },
    gridItem: {
      width: (width - width * 0.12) / 2,
      height: (width - width * 0.12) / 2,
      backgroundColor: 'red',
      borderRadius: width * 0.03,
    },
    VideoPlayIcon: {
      position: 'absolute',
      width: width * 0.1,
      height: width * 0.1,
      top: '50%',
      left: '50%',
      transform: [{ translateX: -width * 0.05 }, { translateY: -width * 0.05 }],
      tintColor: colors.background,
    },

    // Empty Grid State
    emptyGridContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: height * 0.1,
    },
    emptyGridIcon: {
      width: width * 0.2,
      height: width * 0.2,
      marginBottom: height * 0.02,
      tintColor: colors.primary,
    },
    emptyGridTitle: {
      fontSize: scale(22),
      marginBottom: height * 0.01,
      color: colors.text,
    },
    emptyGridSubtitle: {
      fontSize: scale(16),
      textAlign: 'center',
      lineHeight: scale(22),
      paddingHorizontal: width * 0.08,
      color: colors.text,
      opacity: 0.7,
    },

    // Bottom Buttons
    bottomButtonsContainer: {
      padding: width * 0.04,
      gap: width * 0.03,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },

    // Video Preview Mode Styles
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      padding: width * 0.04,
    },

    headerView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: height * 0.02,
      paddingHorizontal: width * 0.01,
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
  });
};

export default useStyle;

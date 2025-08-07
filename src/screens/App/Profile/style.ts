import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { width, height } from '@utils/helper';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    Container: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileHeaderContainer: {
      paddingHorizontal: width * 0.05,
      paddingVertical: height * 0.025,
      backgroundColor: colors.background,
      borderBottomWidth: scale(1),
      borderBottomColor: colors.border,
      gap: scale(10),
    },
    profileImageContainer: {
      alignSelf: 'center',
      position: 'relative',
    },
    profileImage: {
      width: width * 0.25,
      height: width * 0.25,
      borderRadius: width * 0.14,
      borderWidth: scale(3),
      borderColor: colors.primary,
    },

    onlineIndicator: {
      position: 'absolute',
      bottom: scale(5),
      right: scale(5),
      width: scale(18),
      height: scale(18),
      borderRadius: scale(9),
      backgroundColor: colors.green,
      borderWidth: scale(2),
      borderColor: colors.card,
    },

    profileInfoContainer: {
      alignItems: 'center',
      gap: scale(4),
    },

    displayName: {
      fontSize: scale(24),
      color: colors.text,
      textAlign: 'center',
    },

    email: {
      fontSize: scale(18),
      color: colors.text,
      textAlign: 'center',
      opacity: 0.8,
    },

    mobileNo: {
      fontSize: scale(16),
      color: colors.text,
      textAlign: 'center',
      opacity: 0.7,
    },

    profileStats: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    statItem: {
      alignItems: 'center',
      flex: 1,
    },

    statNumber: {
      fontSize: scale(18),
      color: colors.primary,
    },

    statLabel: {
      fontSize: scale(12),
      color: colors.text,
      opacity: 0.7,
      marginTop: scale(2),
    },

    statDivider: {
      width: scale(1),
      height: scale(30),
      backgroundColor: colors.border,
      marginHorizontal: width * 0.05,
    },

    // Original styles for tabs (unchanged as requested)
    contentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    tab: {
      width: width * 0.35,
      paddingVertical: scale(10),
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: scale(2),
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: scale(16),
      color: colors.text,
    },
    activeTabText: {
      color: colors.primary,
    },

    // Content styles
    contentContainer: {
      flex: 1,
      padding: width * 0.03,
    },
    gridContent: {
      flexGrow: 1,
      gap: width * 0.05,
    },
    gridRow: {
      justifyContent: 'space-between',
    },
    imageGridRow: {
      justifyContent: 'space-between',
      marginBottom: scale(5),
    },
    mediaItem: {
      width: width * 0.45,
      height: width * 0.45,
      borderRadius: scale(8),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: height * 0.1,
    },
    emptyText: {
      fontSize: scale(18),
      color: colors.text,
      opacity: 0.7,
    },

    // Legacy styles (keeping for backward compatibility)
    pictureContainer: {
      height: height * 0.22,
      justifyContent: 'center',
      gap: width * 0.04,
      borderBottomWidth: scale(1),
      borderBottomColor: colors.text,
    },
    image: {
      alignSelf: 'center',
      width: width * 0.25,
      height: width * 0.25,
      borderColor: colors.text,
      borderWidth: scale(2),
      borderRadius: width * 0.14,
    },
  });
};

export default useStyle;

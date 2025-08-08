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
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.02,
      backgroundColor: colors.background,
      borderBottomWidth: scale(1),
      borderBottomColor: colors.border,
      gap: scale(15),
    },
    topSectionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImageContainer: {
      position: 'relative',
    },
    profileImage: {
      width: width * 0.22,
      height: width * 0.22,
      borderRadius: width * 0.11,
      borderWidth: scale(3),
      borderColor: colors.primary,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: scale(5),
      right: scale(5),
      width: scale(16),
      height: scale(16),
      borderRadius: scale(8),
      backgroundColor: colors.green,
      borderWidth: scale(2),
      borderColor: colors.card,
    },
    nameAndStatsContainer: {
      flex: 1,
      marginLeft: width * 0.05,
      gap: scale(10),
    },
    profileStats: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
    },
    statItem: {
      alignItems: 'center',
    },
    statSeparator: {
      width: scale(1.5),
      height: scale(30),
      backgroundColor: colors.primary,
    },
    statNumber: {
      fontSize: scale(18),
      color: colors.primary,
    },
    statLabel: {
      fontSize: scale(14),
      color: colors.text,
      marginTop: scale(4),
    },
    profileInfoContainer: {
      alignItems: 'flex-start',
      gap: scale(2),
    },
    displayName: {
      fontSize: scale(18),
      color: colors.text,
      paddingHorizontal: scale(20),
    },
    email: {
      fontSize: scale(14),
      color: colors.text,
      opacity: 0.8,
    },
    mobileNo: {
      fontSize: scale(13),
      color: colors.text,
      opacity: 0.7,
    },
    actionButton: {
      backgroundColor: colors.card,
      borderWidth: scale(1),
      borderColor: colors.border,
      borderRadius: scale(8),
      paddingVertical: scale(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonText: {
      color: colors.text,
      fontSize: scale(14),
    },
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
  });
};

export default useStyle;

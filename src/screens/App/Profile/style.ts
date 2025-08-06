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
    pictureContainer: {
      height: height * 0.3,
      justifyContent: 'center',
      gap: width * 0.045,
      borderBottomWidth: scale(1),
      borderBottomColor: colors.text,
    },
    image: {
      alignSelf: 'center',
      width: width * 0.28,
      height: width * 0.28,
      borderColor: colors.text,
      borderWidth: scale(2),
      borderRadius: width * 0.14,
    },
    email: {
      fontSize: scale(16),
      color: colors.text,
      textAlign: 'center',
    },
    contentHeader: {
      flexDirection: 'row',
    },
    tab: {
      flex: 1,
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
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
  });
};

export default useStyle;
